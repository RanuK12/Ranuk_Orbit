// Ranuk Orbit — Lightbox v8: Apple-style viewer with phase animations,
// swipe gestures, nuclear video kill, type badges, and custom controls.
//
// Architecture:
//   LightboxProvider (context)  → holds { items, index, isOpen }
//   useLightbox()               → consumer hook
//   Lightbox (component)        → renders when isOpen && items.length
//
// The provider lives high in the tree (wraps <App>). Any component can
// call `lb.open(items, idx)` to show the viewer. `lb.close()` unmounts
// it and releases all resources (video decoder, scroll lock, focus).
const { createContext, useContext, useState, useCallback, useEffect, useRef } = React;

const LightboxContext = createContext(null);

// ─── Scroll lock (iOS-safe) ──────────────────────────────────────────
let _savedScrollY = 0;
function lockBodyScroll() {
  try {
    _savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = `-${_savedScrollY}px`;
    document.body.classList.add('body-scroll-locked');
  } catch (_) {}
}
function unlockBodyScroll() {
  try {
    const y = _savedScrollY;
    // Restore scroll position BEFORE removing fixed positioning.
    // This eliminates the visible flash/jump to top that occurred
    // when position:fixed was removed and the browser rendered one
    // frame at scroll=0 before the scrollTo fired.
    document.body.classList.remove('body-scroll-locked');
    document.body.style.top = '';
    window.scrollTo(0, y);
  } catch (_) {}
}

// ─── Provider ────────────────────────────────────────────────────────
function LightboxProvider({ children }) {
  const [state, setState] = useState({ items: [], index: 0, isOpen: false });
  const openerRef = useRef(null);

  const open = useCallback((items, index = 0) => {
    try { openerRef.current = document.activeElement; } catch (_) { openerRef.current = null; }
    setState({ items, index, isOpen: true });
    lockBodyScroll();
  }, []);

  const close = useCallback(() => {
    setState({ items: [], index: 0, isOpen: false });
    unlockBodyScroll();
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    try { if (document.webkitFullscreenElement) document.webkitExitFullscreen(); } catch (_) {}
    try { if (typeof window.__ranukGlobeResetZoom === 'function') window.__ranukGlobeResetZoom(); } catch (_) {}
    try {
      const el = openerRef.current;
      if (el && typeof el.focus === 'function') {
        setTimeout(() => { try { el.focus({ preventScroll: true }); } catch (_) {} }, 0);
      }
    } catch (_) {}
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

// ─── Helpers ─────────────────────────────────────────────────────────
function previewPathFor(src) {
  if (!src) return src;
  const m = src.match(/media\/optimized\/(?:videos-drone|videos-rayban)\/(.+\.(?:mp4|mov))$/i);
  if (!m) return src;
  const previewPath = `/media/optimized/previews/${m[1].replace(/\.(mov|MOV)$/i, '.mp4')}`;
  try { if (window.RANUK_ASSETS && window.RANUK_ASSETS.has(previewPath)) return previewPath; } catch (_) {}
  return `${src}#t=0,8`;
}

const FOCUSABLE_SEL = 'button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

// ─── Icons ───────────────────────────────────────────────────────────
const Icon = {
  close: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  prev: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7"/></svg>,
  next: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5l7 7-7 7"/></svg>,
  play: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 4.5v15a.5.5 0 0 0 .77.42l12-7.5a.5.5 0 0 0 0-.84l-12-7.5A.5.5 0 0 0 7 4.5Z"/></svg>,
  pause: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6.5" y="4.5" width="4" height="15" rx="1"/><rect x="13.5" y="4.5" width="4" height="15" rx="1"/></svg>,
  speakerOn: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/><path d="M14.5 8.5a4 4 0 0 1 0 7"/><path d="M17.5 5.5a8 8 0 0 1 0 13"/></svg>,
  speakerOff: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/><path d="M15 9.5l5 5M20 9.5l-5 5"/></svg>,
  download: () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>,
  videoType: () => <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M4 2.5v11l9-5.5L4 2.5z"/></svg>,
  photoType: () => <svg viewBox="0 0 16 16" width="12" height="12" fill="currentColor"><path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM8 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z"/></svg>,
};

// ─── Lightbox Component ──────────────────────────────────────────────
function Lightbox() {
  const lb = useLightbox();
  const { lang } = useLang();
  const stripRef = useRef(null);
  const rootRef = useRef(null);
  const videoRef = useRef(null);
  const closeBtnRef = useRef(null);
  const [phase, setPhase] = useState('opening'); // opening | open | closing

  // Video controls state
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  // Reset state on item change
  useEffect(() => {
    setPlaying(true);
    setMuted(true);
    setProgress(0);
    setDuration(0);
  }, [lb.index]);

  // Phase animation: opening → open after mount
  useEffect(() => {
    if (!lb.isOpen) return;
    setPhase('opening');
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setPhase('open'));
    });
    return () => cancelAnimationFrame(id);
  }, [lb.isOpen]);

  // Nuclear video kill
  const killVideo = useCallback(() => {
    try {
      const v = videoRef.current;
      if (!v) return;
      v.pause();
      v.removeAttribute('src');
      v.load();
    } catch (_) {}
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => { killVideo(); unlockBodyScroll(); };
  }, [killVideo]);

  // Close with animation
  const onClose = useCallback(() => {
    setPhase('closing');
    killVideo();
    setTimeout(() => { lb.close(); }, 280);
  }, [killVideo, lb]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Video toggle
  const togglePlay = useCallback((e) => {
    if (e) e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play().catch(() => {}); setPlaying(true); }
    else { v.pause(); setPlaying(false); }
  }, []);

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
    const x = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    v.currentTime = pct * duration;
    setProgress(pct);
  }, [duration]);

  // Keyboard
  useEffect(() => {
    if (!lb.isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault(); e.stopPropagation(); onCloseRef.current(); return;
      }
      if (e.key === 'ArrowLeft') { lb.prev(); return; }
      if (e.key === 'ArrowRight') { lb.next(); return; }
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); return; }
      // Focus trap
      if (e.key === 'Tab' && rootRef.current) {
        const focusable = Array.from(rootRef.current.querySelectorAll(FOCUSABLE_SEL))
          .filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0], last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => document.removeEventListener('keydown', onKey, true);
  }, [lb.isOpen, lb.prev, lb.next, togglePlay]);

  // Focus close button on open
  useEffect(() => {
    if (!lb.isOpen) return;
    const id = setTimeout(() => {
      try { closeBtnRef.current && closeBtnRef.current.focus({ preventScroll: true }); } catch (_) {}
    }, 50);
    return () => clearTimeout(id);
  }, [lb.isOpen]);

  // Scroll thumb into view
  useEffect(() => {
    if (!lb.isOpen || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-i="${lb.index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lb.index, lb.isOpen]);

  // Swipe gestures (mobile)
  const touchStart = useRef({ x: 0, y: 0 });
  const onTouchStart = useCallback((e) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }, []);
  const onTouchEnd = useCallback((e) => {
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const threshold = 50;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > threshold) {
      dx > 0 ? lb.prev() : lb.next();
    } else if (dy > threshold && Math.abs(dy) > Math.abs(dx)) {
      onCloseRef.current();
    }
  }, [lb]);

  // ─── Render gate ───────────────────────────────────────────────────
  if (!lb.isOpen || !lb.items.length) return null;

  const item = lb.items[lb.index];
  const title = item._displayTitle || (typeof pick === 'function' ? pick(item.title, lang) : '') || '';
  const isVideo = item.type === 'video' || item.type === 'pov';
  const locName = item.location ? (typeof pick === 'function' ? pick(item.location.name, lang) : '') : '';

  // i18n labels
  const closeLabel = lang === 'es' ? 'Cerrar' : lang === 'it' ? 'Chiudi' : 'Close';
  const prevLabel = lang === 'es' ? 'Anterior' : lang === 'it' ? 'Precedente' : 'Previous';
  const nextLabel = lang === 'es' ? 'Siguiente' : lang === 'it' ? 'Successivo' : 'Next';
  const dlLabel = isVideo
    ? (lang === 'es' ? 'Descargar preview' : lang === 'it' ? 'Scarica preview' : 'Download preview')
    : (lang === 'es' ? 'Descargar' : lang === 'it' ? 'Scarica' : 'Download');
  const typeLabel = item.type === 'pov' ? 'POV' : isVideo ? 'Video' : 'Photo';
  const typeBadgeClass = item.type === 'pov' ? 'lb-type-badge--pov' : isVideo ? 'lb-type-badge--video' : 'lb-type-badge--photo';

  const fmtTime = (s) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const downloadHref = isVideo ? previewPathFor(item.src) : item.src;

  return (
    <div
      className={`lightbox lightbox--${phase}`}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop */}
      <div className="lb-backdrop" onClick={onClose} aria-hidden="true" />

      {/* Header: counter + type badge + close */}
      <div className="lb-header">
        <div className="lb-header-info">
          <span className="lb-header-counter">{lb.index + 1} / {lb.items.length}</span>
          <span className="lb-header-divider" />
          <span className={`lb-type-badge ${typeBadgeClass}`}>
            {isVideo ? <Icon.videoType /> : <Icon.photoType />}
            {typeLabel}
          </span>
        </div>
        <button
          ref={closeBtnRef}
          type="button"
          className="lb-close"
          onClick={onClose}
          aria-label={closeLabel}
          title={closeLabel}
        >
          <Icon.close />
        </button>
      </div>

      {/* Nav arrows */}
      {lb.items.length > 1 && (
        <>
          <button type="button" className="lb-nav lb-nav-prev" onClick={lb.prev} aria-label={prevLabel}><Icon.prev /></button>
          <button type="button" className="lb-nav lb-nav-next" onClick={lb.next} aria-label={nextLabel}><Icon.next /></button>
        </>
      )}

      {/* Stage */}
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
            {/* Play overlay when paused */}
            {!playing && (
              <button className="media-card__play-btn" onClick={togglePlay} style={{ opacity: 1, transform: 'translate(-50%,-50%) scale(1)', pointerEvents: 'auto' }}>
                <svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="30" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/><path d="M26 20l20 12-20 12V20z" fill="white"/></svg>
              </button>
            )}
            {/* Custom controls */}
            <div className="lb-video-controls" onClick={(e) => e.stopPropagation()}>
              <button type="button" className="lb-vbtn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? <Icon.pause /> : <Icon.play />}
              </button>
              <div className="lb-progress" onClick={onSeek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress * 100)}>
                <div className="lb-progress-track" />
                <div className="lb-progress-fill" style={{ width: `${progress * 100}%` }} />
                <div className="lb-progress-handle" style={{ left: `${progress * 100}%` }} />
              </div>
              <span className="lb-time">{fmtTime(videoRef.current?.currentTime || 0)} · {fmtTime(duration)}</span>
              <button type="button" className="lb-vbtn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? <Icon.speakerOff /> : <Icon.speakerOn />}
              </button>
            </div>
          </div>
        ) : (
          <div className="lb-media-wrap">
            <img key={item.id} className="lb-media" src={item.src} alt={title} />
          </div>
        )}

        {/* Caption */}
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
          <a href={downloadHref} download className="lb-download" onClick={(e) => e.stopPropagation()} aria-label={dlLabel}>
            <Icon.download /><span>{dlLabel}</span>
          </a>
        </div>

        {/* Thumbnail strip */}
        {lb.items.length > 1 && (
          <div className="lb-strip" ref={stripRef}>
            {lb.items.map((it, i) => {
              const thumbSrc = it.type === 'photo' ? it.src : (it.poster || it.src);
              const isActive = i === lb.index;
              const isVid = it.type === 'video' || it.type === 'pov';
              return (
                <button key={it.id} data-i={i} className={`lb-thumb${isActive ? ' is-active' : ''}`} onClick={() => lb.goto(i)} aria-label={`Item ${i + 1}`}>
                  <img src={thumbSrc} loading="lazy" alt="" />
                  {isVid && (
                    <span className="lb-thumb-badge">
                      <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2l7 4-7 4z"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Hints */}
      <div className="lb-hint lb-hint-counter">{lb.index + 1} / {lb.items.length}</div>
      <div className="lb-hint lb-hint-esc">{lang === 'es' ? 'ESC para cerrar · Swipe ↓' : lang === 'it' ? 'ESC per chiudere · Swipe ↓' : 'ESC to close · Swipe ↓'}</div>
    </div>
  );
}

Object.assign(window, { LightboxProvider, useLightbox, Lightbox, lockBodyScroll, unlockBodyScroll });
