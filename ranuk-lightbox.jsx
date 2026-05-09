// Ranuk Orbit — Lightbox v4: custom video controls so the native <video>
// chrome never competes with the overlay UI. Close button always wins.
const { createContext, useContext, useState, useCallback, useEffect, useRef } = React;

const LightboxContext = createContext(null);

function LightboxProvider({ children }) {
  const [state, setState] = useState({ items: [], index: 0, open: false });
  const open = useCallback((items, index = 0) => {
    setState({ items, index, open: true });
    try { document.body.style.overflow = 'hidden'; } catch (_) {}
  }, []);
  const close = useCallback(() => {
    setState(s => ({ ...s, open: false }));
    try { document.body.style.overflow = ''; } catch (_) {}
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    // If the lightbox was opened from a globe pin, ease the camera back
    // to its default orbit distance so the user sees the reverse of the
    // cinematic zoom-in instead of a cold cut back to the atlas view.
    try { if (typeof window.__ranukGlobeResetZoom === 'function') window.__ranukGlobeResetZoom(); } catch (_) {}
  }, []);
  const prev = useCallback(() => setState(s => s.items.length ? ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length }) : s), []);
  const next = useCallback(() => setState(s => s.items.length ? ({ ...s, index: (s.index + 1) % s.items.length }) : s), []);
  const goto = useCallback((i) => setState(s => ({ ...s, index: i })), []);
  return (
    <LightboxContext.Provider value={{ ...state, open, close, prev, next, goto }}>
      {children}
    </LightboxContext.Provider>
  );
}
function useLightbox() { return useContext(LightboxContext); }

// Convert a video src to its 8s preview path. Mirrors gen-previews.sh layout.
// If the preview is not registered in window.RANUK_ASSETS, fall back to a
// media-fragment URL (#t=0,8) so the browser only streams the first 8s.
function previewPathFor(src) {
  if (!src) return src;
  const m = src.match(/media\/optimized\/(?:videos-drone|videos-rayban)\/(.+\.(?:mp4|mov))$/i);
  if (!m) return src;
  const previewPath = `media/optimized/previews/${m[1].replace(/\.(mov|MOV)$/i, '.mp4')}`;
  try {
    if (window.RANUK_ASSETS && window.RANUK_ASSETS.has(previewPath)) return previewPath;
  } catch (_) {}
  return `${src}#t=0,8`;
}

function Lightbox() {
  const lb = useLightbox();
  const { lang } = useLang();
  const stripRef = useRef(null);
  const rootRef = useRef(null);
  const videoRef = useRef(null);

  // Custom video controls state. We deliberately do NOT use the browser's
  // native <video controls> chrome — on iOS Safari the native controls
  // capture pointer events aggressively and shadow the overlay close
  // button (the root cause of the persistent "close doesn't work" bug).
  // By rendering our own play/pause + mute buttons inside the lightbox
  // tree, we guarantee that the close button always wins taps.
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset custom-control state each time the active item changes.
  useEffect(() => {
    setPlaying(true);
    setMuted(true);
    setProgress(0);
    setDuration(0);
  }, [lb.index]);

  // Global keyboard handling while open
  useEffect(() => {
    if (!lb.open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); hardClose(); }
      else if (e.key === 'ArrowLeft') lb.prev();
      else if (e.key === 'ArrowRight') lb.next();
      else if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb.open, lb.index, lb.close, lb.prev, lb.next]);

  // Failsafe: restore body scroll if the component unmounts while open
  useEffect(() => () => { try { document.body.style.overflow = ''; } catch (_) {} }, []);

  // Scroll active thumb into view
  useEffect(() => {
    if (!lb.open || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-i="${lb.index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lb.index, lb.open]);

  // Backdrop tap: close only when the target is the root element itself.
  const handleBackdrop = useCallback((e) => {
    if (e.target === rootRef.current) {
      e.preventDefault();
      hardClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lb]);

  // Robust close: stops the video, drops any fullscreen, calls lb.close().
  const hardClose = (e) => {
    if (e) {
      try { e.preventDefault(); } catch (_) {}
      try { e.stopPropagation(); } catch (_) {}
    }
    try {
      const v = videoRef.current;
      if (v) { v.pause(); v.removeAttribute('controls'); v.currentTime = 0; }
    } catch (_) {}
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    try { if (document.webkitFullscreenElement) document.webkitExitFullscreen(); } catch (_) {}
    lb.close();
  };

  const togglePlay = (e) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  };

  const toggleMute = (e) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const onSeek = (e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches?.[0]?.clientX)) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    v.currentTime = pct * duration;
    setProgress(pct);
  };

  if (!lb.open || !lb.items.length) return null;
  const item = lb.items[lb.index];
  const title = item._displayTitle || pick(item.title, lang) || '';
  const isVideo = item.type === 'video' || item.type === 'pov';
  const exif = item.exif || {};
  const locName = item.location ? pick(item.location.name, lang) : '';

  const dlLabel = lang === 'es' ? 'Descargar preview (8s)' : lang === 'it' ? 'Scarica preview (8s)' : 'Download preview (8s)';
  const dlPhotoLabel = lang === 'es' ? 'Descargar foto' : lang === 'it' ? 'Scarica foto' : 'Download photo';
  const closeLabel = lang === 'es' ? 'Cerrar' : lang === 'it' ? 'Chiudi' : 'Close';
  const escHint = lang === 'es' ? 'ESC para cerrar' : lang === 'it' ? 'ESC per chiudere' : 'ESC to close';
  const playLabel = lang === 'es' ? 'Reproducir' : lang === 'it' ? 'Riproduci' : 'Play';
  const pauseLabel = lang === 'es' ? 'Pausar' : lang === 'it' ? 'Metti in pausa' : 'Pause';
  const soundOn = lang === 'es' ? 'Con sonido' : lang === 'it' ? 'Audio attivo' : 'Sound on';
  const soundOff = lang === 'es' ? 'Sin sonido' : lang === 'it' ? 'Audio disattivato' : 'Sound off';

  const downloadHref = isVideo ? previewPathFor(item.src) : item.src;

  const fmtTime = (s) => {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60).toString().padStart(2, '0');
    return `${m}:${ss}`;
  };

  return (
    <div
      className="lightbox"
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={handleBackdrop}
    >
      <div className="lb-topbar">
        <span className="lb-counter">{lb.index + 1} / {lb.items.length}</span>
        <span className="lb-esc-hint">{escHint}</span>
        <button
          type="button"
          className="lb-close"
          onPointerUp={hardClose}
          onClick={hardClose}
          aria-label={closeLabel}
        >
          <span aria-hidden="true">×</span>
          <span className="lb-close-label">{closeLabel}</span>
        </button>
      </div>

      {/* Invisible top-right safety zone. Covers the corner so a tap there
          always closes the lightbox, even if a different element grabbed
          the pointer. Lower z-index than the visible .lb-close so the
          styled button is what the user interacts with when they aim. */}
      <button
        type="button"
        className="lb-close-zone"
        aria-label={closeLabel}
        onPointerUp={hardClose}
        onClick={hardClose}
      />

      {lb.items.length > 1 && (
        <>
          <button
            type="button"
            className="lb-nav lb-nav-prev"
            onClick={(e) => { e.stopPropagation(); lb.prev(); }}
            aria-label="Previous"
          >‹</button>
          <button
            type="button"
            className="lb-nav lb-nav-next"
            onClick={(e) => { e.stopPropagation(); lb.next(); }}
            aria-label="Next"
          >›</button>
        </>
      )}

      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <div className="lb-video-wrap">
            <video
              key={item.id}
              ref={videoRef}
              className="lb-media"
              src={item.src}
              poster={item.poster || undefined}
              // No native controls — we render our own below. This is the
              // decisive fix for the iOS Safari close-button bug.
              disablePictureInPicture
              autoPlay
              playsInline
              muted={muted}
              onClick={togglePlay}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
              onTimeUpdate={(e) => {
                const d = e.currentTarget.duration;
                if (d) setProgress(e.currentTarget.currentTime / d);
              }}
              onEnded={() => setPlaying(false)}
            />
            <div className="lb-video-controls" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="lb-vbtn"
                onClick={togglePlay}
                aria-label={playing ? pauseLabel : playLabel}
              >
                {playing ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <rect x="3" y="2" width="4" height="12" rx="1"/>
                    <rect x="9" y="2" width="4" height="12" rx="1"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M3 2 L13 8 L3 14 Z"/>
                  </svg>
                )}
              </button>
              <div className="lb-progress" onClick={onSeek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)}>
                <div className="lb-progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="lb-time">
                {fmtTime((videoRef.current?.currentTime) || 0)} / {fmtTime(duration)}
              </span>
              <button
                type="button"
                className="lb-vbtn"
                onClick={toggleMute}
                aria-label={muted ? soundOff : soundOn}
              >
                {muted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M11 5L6 9H2v6h4l5 4V5z"/>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                  </svg>
                )}
              </button>
            </div>
          </div>
        ) : (
          <img key={item.id} className="lb-media" src={item.src} alt={title} />
        )}

        <div className="lb-meta">
          <div className="lb-meta-main">
            <h3 className="lb-title">{title}</h3>
            <div className="lb-loc">
              {locName && <span>{locName}</span>}
              {item.year && <span className="lb-dot">·</span>}
              {item.year && <span>{item.year}</span>}
              {item.location?.flag && <span className="lb-flag">{item.location.flag}</span>}
            </div>
          </div>
          <div className="lb-exif">
            {exif.camera && <div className="lb-exif-item"><span className="lb-exif-label">Camera</span><span>{exif.camera}</span></div>}
            {exif.lens && <div className="lb-exif-item"><span className="lb-exif-label">Lens</span><span>{exif.lens}</span></div>}
            {exif.loc && <div className="lb-exif-item"><span className="lb-exif-label">Location</span><span>{exif.loc}</span></div>}
            {item.altitude && <div className="lb-exif-item"><span className="lb-exif-label">Altitude</span><span>{item.altitude}</span></div>}
            {item.mood && <div className="lb-exif-item"><span className="lb-exif-label">Mood</span><span>{item.mood}</span></div>}
          </div>
          <div className="lb-actions">
            <a
              href={downloadHref}
              download
              className="lb-download"
              onClick={(e) => e.stopPropagation()}
            >↓ {isVideo ? dlLabel : dlPhotoLabel}</a>
          </div>
        </div>

        {lb.items.length > 1 && (
          <div className="lb-strip" ref={stripRef}>
            {lb.items.map((it, i) => {
              const thumbSrc = it.type === 'photo' ? it.src : (it.poster || it.src);
              const isActive = i === lb.index;
              return (
                <button
                  key={it.id}
                  data-i={i}
                  className={`lb-thumb${isActive ? ' is-active' : ''}`}
                  onClick={(e) => { e.stopPropagation(); lb.goto(i); }}
                  aria-label={`Item ${i+1}`}
                >
                  {it.type === 'photo' ? (
                    <img src={thumbSrc} loading="lazy" alt="" />
                  ) : (
                    <div className="lb-thumb-vid" style={{ backgroundColor: '#111' }}>
                      <span className="lb-thumb-play">▶</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { LightboxProvider, useLightbox, Lightbox });
