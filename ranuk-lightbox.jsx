// Ranuk Orbit — Lightbox v6: Apple-inspired premium viewer with
// bulletproof close handling.
//
// Design goals:
//   • Media is protagonist — chrome is transparent until the user looks
//     for it (hover on pointer devices, always visible on touch).
//   • Close is bulletproof: X button, click on backdrop, AND ESC key
//     all route through hardClose(). Event listeners are attached once
//     on mount (not on every render) and use capture-phase + document
//     so they can't be swallowed by a focused <video> element on iOS.
//   • We also listen for fullscreenchange — if iOS Safari pushes the
//     <video> into native fullscreen and the user presses ESC to exit
//     fullscreen, we use that signal to close the lightbox cleanly.
//   • No native <video controls>. iOS Safari's native chrome was the
//     root cause of the "can't close" bug (it captures pointer events
//     at a z-index that shadows the overlay). We render our own thin
//     custom controls that behave consistently everywhere.
//
// Why v5 still looked broken in the wild: the ESC-key useEffect depended
// on hardClose, which in turn depended on the unstable `lb` context
// value. On every render the effect tore down and re-registered the
// listener, creating tiny windows where the key event could land on no
// handler at all. v6 uses a ref so the listener is installed ONCE per
// mount and always reads the latest handler via the ref.
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
  const previewPath = `/media/optimized/previews/${m[1].replace(/\.(mov|MOV)$/i, '.mp4')}`;
  try {
    if (window.RANUK_ASSETS && window.RANUK_ASSETS.has(previewPath)) return previewPath;
  } catch (_) {}
  return `${src}#t=0,8`;
}

// ──────────────────────────────────────────────────────────────────────
// Thin SF-symbol style glyphs. stroke: currentColor · 1.5px.
// ──────────────────────────────────────────────────────────────────────
const Icon = {
  close: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" {...p}>
      <path d="M6 6l12 12M18 6L6 18"/>
    </svg>
  ),
  prev: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M15 5l-7 7 7 7"/>
    </svg>
  ),
  next: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M9 5l7 7-7 7"/>
    </svg>
  ),
  play: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
      <path d="M7 4.5v15a.5.5 0 0 0 .77.42l12-7.5a.5.5 0 0 0 0-.84l-12-7.5A.5.5 0 0 0 7 4.5Z"/>
    </svg>
  ),
  pause: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" {...p}>
      <rect x="6.5" y="4.5" width="4" height="15" rx="1"/>
      <rect x="13.5" y="4.5" width="4" height="15" rx="1"/>
    </svg>
  ),
  speakerOn: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/>
      <path d="M14.5 8.5a4 4 0 0 1 0 7"/>
      <path d="M17.5 5.5a8 8 0 0 1 0 13"/>
    </svg>
  ),
  speakerOff: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/>
      <path d="M15 9.5l5 5M20 9.5l-5 5"/>
    </svg>
  ),
  download: (p) => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
      <path d="M12 4v12"/>
      <path d="M7 11l5 5 5-5"/>
      <path d="M5 20h14"/>
    </svg>
  ),
};

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

  // ────────────────────────────────────────────────────────────────────
  // Bulletproof close handling.
  //
  // Design: we keep a ref to the current `close everything` function so
  // the global keydown listener can call the LATEST version without ever
  // tearing down and re-registering. That closes the race window where
  // v5 could miss a keystroke during a re-render.
  // ────────────────────────────────────────────────────────────────────
  const hardCloseRef = useRef(() => {});
  hardCloseRef.current = () => {
    try {
      const v = videoRef.current;
      if (v) { v.pause(); v.removeAttribute('controls'); v.currentTime = 0; }
    } catch (_) {}
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    try { if (document.webkitFullscreenElement) document.webkitExitFullscreen(); } catch (_) {}
    lb.close();
  };

  // Stable wrapper that event handlers can call. This is also what the
  // X button's onClick/onPointerDown invoke.
  const hardClose = useCallback((e) => {
    if (e) {
      try { e.preventDefault(); } catch (_) {}
      try { e.stopPropagation(); } catch (_) {}
    }
    hardCloseRef.current();
  }, []);

  const togglePlay = useCallback((e) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

  // Global keyboard + fullscreen listeners. Installed ONCE when the
  // lightbox opens, removed when it closes. Uses document + capture
  // phase so no nested element (including a focused <video>) can
  // swallow the event before we see it.
  useEffect(() => {
    if (!lb.open) return;

    const onKey = (e) => {
      // Some browsers still report `keyCode` (27 for ESC) — we check
      // both to cover every vendor. Also accept 'Esc' (legacy IE).
      const isEsc = e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
      if (isEsc) {
        e.preventDefault();
        e.stopPropagation();
        hardCloseRef.current();
        return;
      }
      if (e.key === 'ArrowLeft') { lb.prev(); return; }
      if (e.key === 'ArrowRight') { lb.next(); return; }
      if (e.key === ' ' || e.key === 'k') {
        e.preventDefault();
        togglePlay();
      }
    };

    // If the native <video> element happens to enter fullscreen on iOS
    // Safari (some gestures can still trigger it despite playsInline),
    // the subsequent ESC press is consumed by the fullscreen layer. We
    // detect the exit and close the lightbox so the user isn't left
    // staring at a persistent viewer after dismissing fullscreen.
    const onFsChange = () => {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        // Small delay so Safari finishes tearing down the fullscreen UI.
        setTimeout(() => {
          try { hardCloseRef.current(); } catch (_) {}
        }, 20);
      }
    };

    document.addEventListener('keydown', onKey, true);
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('keydown', onKey, true);
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, [lb.open, lb.prev, lb.next, togglePlay]);

  // Failsafe: restore body scroll if the component unmounts while open
  useEffect(() => () => { try { document.body.style.overflow = ''; } catch (_) {} }, []);

  // Scroll active thumb into view
  useEffect(() => {
    if (!lb.open || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-i="${lb.index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lb.index, lb.open]);

  // Backdrop click: close only when the target is the root element itself,
  // not when the user clicked a child (stage, caption, strip, etc.)
  const handleBackdrop = useCallback((e) => {
    if (e.target === rootRef.current) hardClose(e);
  }, [hardClose]);

  const toggleMute = useCallback((e) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const onSeek = useCallback((e) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX ?? (e.touches?.[0]?.clientX)) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    v.currentTime = pct * duration;
    setProgress(pct);
  }, [duration]);

  if (!lb.open || !lb.items.length) return null;
  const item = lb.items[lb.index];
  const title = item._displayTitle || pick(item.title, lang) || '';
  const isVideo = item.type === 'video' || item.type === 'pov';
  const exif = item.exif || {};
  const locName = item.location ? pick(item.location.name, lang) : '';

  const dlLabel = lang === 'es' ? 'Descargar preview (8s)' : lang === 'it' ? 'Scarica preview (8s)' : 'Download preview (8s)';
  const dlPhotoLabel = lang === 'es' ? 'Descargar' : lang === 'it' ? 'Scarica' : 'Download';
  const closeLabel = lang === 'es' ? 'Cerrar' : lang === 'it' ? 'Chiudi' : 'Close';
  const escHint = lang === 'es' ? 'ESC para cerrar' : lang === 'it' ? 'ESC per chiudere' : 'ESC to close';
  const prevLabel = lang === 'es' ? 'Anterior' : lang === 'it' ? 'Precedente' : 'Previous';
  const nextLabel = lang === 'es' ? 'Siguiente' : lang === 'it' ? 'Successivo' : 'Next';
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
      {/* Floating close — always on top, always clickable. We bind to
          onPointerDown so the close happens on press (before the
          corresponding click event has a chance to be swallowed by a
          focused <video>), and to onClick as a fallback for keyboard /
          assistive-tech activation. */}
      <button
        type="button"
        className="lb-close"
        onPointerDown={hardClose}
        onClick={hardClose}
        aria-label={closeLabel}
        title={closeLabel}
      >
        <Icon.close />
      </button>

      {lb.items.length > 1 && (
        <>
          <button
            type="button"
            className="lb-nav lb-nav-prev"
            onClick={(e) => { e.stopPropagation(); lb.prev(); }}
            aria-label={prevLabel}
            title={prevLabel}
          ><Icon.prev /></button>
          <button
            type="button"
            className="lb-nav lb-nav-next"
            onClick={(e) => { e.stopPropagation(); lb.next(); }}
            aria-label={nextLabel}
            title={nextLabel}
          ><Icon.next /></button>
        </>
      )}

      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <div className="lb-media-wrap lb-media-wrap--video">
            <video
              key={item.id}
              ref={videoRef}
              className="lb-media"
              src={item.src}
              poster={item.poster || undefined}
              disablePictureInPicture
              // Explicitly forbid the native fullscreen button — on iOS
              // Safari it was the escape hatch that put the video into
              // a mode where our ESC handler couldn't reach it.
              controlsList="nodownload nofullscreen noplaybackrate"
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
                {playing ? <Icon.pause /> : <Icon.play />}
              </button>
              <div
                className="lb-progress"
                onClick={onSeek}
                role="slider"
                aria-label="Seek"
                aria-valuenow={Math.round(progress * 100)}
              >
                <div className="lb-progress-track" />
                <div className="lb-progress-fill" style={{ width: `${progress * 100}%` }} />
              </div>
              <span className="lb-time">
                {fmtTime((videoRef.current?.currentTime) || 0)} · {fmtTime(duration)}
              </span>
              <button
                type="button"
                className="lb-vbtn"
                onClick={toggleMute}
                aria-label={muted ? soundOff : soundOn}
              >
                {muted ? <Icon.speakerOff /> : <Icon.speakerOn />}
              </button>
            </div>
          </div>
        ) : (
          <div className="lb-media-wrap">
            <img key={item.id} className="lb-media" src={item.src} alt={title} />
          </div>
        )}

        <div className="lb-caption">
          <div className="lb-caption-main">
            <h3 className="lb-title">{title}</h3>
            <div className="lb-sub">
              {locName && <span>{locName}</span>}
              {locName && item.year && <span className="lb-dot">·</span>}
              {item.year && <span>{item.year}</span>}
              {item.location?.flag && <span className="lb-flag" aria-hidden="true">{item.location.flag}</span>}
            </div>
          </div>
          {(exif.camera || exif.lens || item.altitude || item.mood) && (
            <div className="lb-exif">
              {exif.camera && <span className="lb-exif-item">{exif.camera}</span>}
              {exif.lens && <span className="lb-exif-item">{exif.lens}</span>}
              {item.altitude && <span className="lb-exif-item">{item.altitude}</span>}
              {item.mood && <span className="lb-exif-item">{item.mood}</span>}
            </div>
          )}
          <a
            href={downloadHref}
            download
            className="lb-download"
            onClick={(e) => e.stopPropagation()}
            aria-label={isVideo ? dlLabel : dlPhotoLabel}
          >
            <Icon.download />
            <span>{isVideo ? dlLabel : dlPhotoLabel}</span>
          </a>
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
                    <>
                      {it.poster ? <img src={it.poster} loading="lazy" alt="" /> : <div className="lb-thumb-bg" />}
                      <span className="lb-thumb-badge" aria-hidden="true">
                        <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2l7 4-7 4z"/></svg>
                      </span>
                    </>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tiny corner hints — fade in subtly, never compete with the media */}
      <div className="lb-hint lb-hint-counter">{lb.index + 1} / {lb.items.length}</div>
      <div className="lb-hint lb-hint-esc">{escHint}</div>
    </div>
  );
}

Object.assign(window, { LightboxProvider, useLightbox, Lightbox });
