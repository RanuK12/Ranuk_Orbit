// Ranuk Orbit — Lightbox v9: Premium multimedia viewer with Gallery/Cinema modes,
// scroll-fix, transitions, keyboard shortcuts, and premium UI.
//
// Architecture:
//   LightboxProvider (context)  → holds { items, index, isOpen }
//   useLightbox()               → consumer hook
//   Lightbox (component)        → renders when isOpen && items.length
const { createContext, useContext, useState, useCallback, useEffect, useRef } = React;

const LightboxContext = createContext(null);

// ─── Scroll lock (position:fixed approach — eliminates flash on close) ───
const _scrollState = { y: 0, bodyStyles: {} };

function lockBodyScroll() {
  _scrollState.y = window.scrollY || window.pageYOffset || 0;
  _scrollState.bodyStyles = {
    position: document.body.style.position || '',
    top: document.body.style.top || '',
    width: document.body.style.width || '',
    overflow: document.body.style.overflow || '',
  };
  document.body.style.position = 'fixed';
  document.body.style.top = `-${_scrollState.y}px`;
  document.body.style.width = '100%';
  document.body.style.overflow = 'hidden';
}

function unlockBodyScroll() {
  document.body.style.position = _scrollState.bodyStyles.position;
  document.body.style.top = _scrollState.bodyStyles.top;
  document.body.style.width = _scrollState.bodyStyles.width;
  document.body.style.overflow = _scrollState.bodyStyles.overflow;
  window.scrollTo(0, _scrollState.y);
}

// ─── Provider ────────────────────────────────────────────────────────
function LightboxProvider({ children }) {
  const [state, setState] = useState({ items: [], index: 0, isOpen: false });
  const openerRef = useRef(null);

  const open = useCallback((items, index = 0) => {
    try { openerRef.current = document.activeElement; } catch (_) { openerRef.current = null; }
    lockBodyScroll();
    setState({ items, index, isOpen: true });
  }, []);

  const close = useCallback(() => {
    setState({ items: [], index: 0, isOpen: false });
    unlockBodyScroll();
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    try { if (document.webkitFullscreenElement) document.webkitExitFullscreen(); } catch (_) {}
    try { if (typeof window.__ranukGlobeResetZoom === 'function') window.__ranukGlobeResetZoom(); } catch (_) {}
    try {
      const el = openerRef.current;
      if (el && typeof el.focus === 'function') el.focus({ preventScroll: true });
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
  playLarge: () => <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M7 4.5v15a.5.5 0 0 0 .77.42l12-7.5a.5.5 0 0 0 0-.84l-12-7.5A.5.5 0 0 0 7 4.5Z"/></svg>,
  pause: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><rect x="6.5" y="4.5" width="4" height="15" rx="1"/><rect x="13.5" y="4.5" width="4" height="15" rx="1"/></svg>,
  speakerOn: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/><path d="M14.5 8.5a4 4 0 0 1 0 7"/><path d="M17.5 5.5a8 8 0 0 1 0 13"/></svg>,
  speakerOff: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 6.5L5.5 10H3v4h2.5L10 17.5V6.5z" fill="currentColor" stroke="none"/><path d="M15 9.5l5 5M20 9.5l-5 5"/></svg>,
  download: () => <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4v12"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>,
  fullscreen: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/></svg>,
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
  const timelineRef = useRef(null);
  const [phase, setPhase] = useState('opening');
  const [navDirection, setNavDirection] = useState(null); // 'left' | 'right'

  // Video controls state
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipTime, setTooltipTime] = useState('0:00');
  const [tooltipX, setTooltipX] = useState(0);
  const [volume, setVolume] = useState(1);
  const [buffering, setBuffering] = useState(false);
  const [seekFlash, setSeekFlash] = useState(null); // 'fwd' | 'back'

  // Refs that mirror state so stable (deps-free) callbacks & event
  // listeners always read the latest value without re-subscribing.
  const scrubbingRef = useRef(false);
  const durRef = useRef(0);
  const volRef = useRef(1);
  const videoActiveRef = useRef(false);
  // Ambient-mode glow element + sampling loop handle.
  const glowRef = useRef(null);
  const ambientRef = useRef({ timer: 0, canvas: null, ctx: null });
  const videoTapRef = useRef({ t: 0 });

  // Reset state on item change (volume persists across items)
  useEffect(() => {
    setPlaying(true);
    setMuted(true);
    setProgress(0);
    setBuffered(0);
    setDuration(0);
    setIsVideoReady(false);
    setBuffering(false);
    setSeekFlash(null);
    // Clear nav direction after animation
    const id = setTimeout(() => setNavDirection(null), 400);
    return () => clearTimeout(id);
  }, [lb.index]);

  // Video duration & time tracking via addEventListener
  // (fixes "0:00 / 0:00" when loadedmetadata fires before React attaches inline handlers)
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    function onLoaded() {
      if (video.duration && isFinite(video.duration)) {
        setDuration(video.duration);
        setIsVideoReady(true);
      }
      // Re-apply the volume the user picked on the previous clip.
      try { video.volume = volRef.current; } catch (_) {}
    }

    function onTimeUpdate() {
      // While the user drags the playhead we drive currentTime ourselves;
      // ignore the browser's timeupdate so the thumb doesn't fight back.
      if (!scrubbingRef.current) setProgress(video.currentTime);
    }

    function onEnded() {
      setPlaying(false);
    }

    // Buffering spinner: 'waiting' fires when playback stalls for data,
    // 'playing'/'canplay' when it resumes.
    const onWaiting = () => setBuffering(true);
    const onResume = () => setBuffering(false);

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('durationchange', onLoaded);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('ended', onEnded);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('playing', onResume);
    video.addEventListener('canplay', onResume);

    // If the video already has metadata (browser cache)
    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('durationchange', onLoaded);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('playing', onResume);
      video.removeEventListener('canplay', onResume);
    };
  }, [lb.index]);

  // ─── Ambient Mode ──────────────────────────────────────────────────
  // Sample the average colour of the current video frame a few times a
  // second and bleed it as a soft glow behind the player — YouTube's
  // ambient mode, tuned for cinematic aerial footage. Writes straight to
  // the glow node's style (no React re-render churn) and only runs while
  // a video is actually playing and the tab is visible.
  useEffect(() => {
    if (!lb.isOpen) return;
    const a = ambientRef.current;
    if (!a.canvas) {
      a.canvas = document.createElement('canvas');
      a.canvas.width = 16; a.canvas.height = 9;
      a.ctx = a.canvas.getContext('2d', { willReadFrequently: true });
    }
    const sample = () => {
      const v = videoRef.current, glow = glowRef.current;
      if (!v || !glow || v.paused || v.readyState < 2 || document.hidden) return;
      try {
        a.ctx.drawImage(v, 0, 0, 16, 9);
        const d = a.ctx.getImageData(0, 0, 16, 9).data;
        let r = 0, g = 0, b = 0, n = d.length / 4;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; }
        r = Math.round(r / n); g = Math.round(g / n); b = Math.round(b / n);
        glow.style.background =
          `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(${r},${g},${b},0.55) 0%, rgba(${r},${g},${b},0.22) 45%, transparent 75%)`;
        glow.style.opacity = '1';
      } catch (_) { /* tainted frame (shouldn't happen, same-origin) */ }
    };
    a.timer = setInterval(sample, 220);
    return () => { clearInterval(a.timer); };
  }, [lb.index, lb.isOpen]);

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

  // Close with animation — NO setTimeout for scroll, NO hash manipulation
  const onClose = useCallback(() => {
    setPhase('closing');
    killVideo();
    setTimeout(() => { lb.close(); }, 280);
  }, [killVideo, lb]);

  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Navigation with direction tracking
  const goPrev = useCallback(() => {
    setNavDirection('left');
    lb.prev();
  }, [lb]);

  const goNext = useCallback(() => {
    setNavDirection('right');
    lb.next();
  }, [lb]);

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

  // ─── Scrubbing (click + drag) ──────────────────────────────────────
  const seekToClientX = useCallback((clientX) => {
    const v = videoRef.current, tl = timelineRef.current, d = durRef.current;
    if (!v || !d || !tl || clientX == null) return;
    const rect = tl.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    v.currentTime = pct * d;
    setProgress(pct * d);
  }, []);

  const onScrubMove = useCallback((e) => {
    if (!scrubbingRef.current) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    seekToClientX(x);
    const tl = timelineRef.current, d = durRef.current;
    if (tl && d && x != null) {
      const rect = tl.getBoundingClientRect();
      const lx = Math.max(0, Math.min(rect.width, x - rect.left));
      setTooltipX(lx);
      setTooltipTime(fmtTime((lx / rect.width) * d));
      setShowTooltip(true);
    }
  }, [seekToClientX]);

  const onScrubEnd = useCallback(() => {
    scrubbingRef.current = false;
    setShowTooltip(false);
    window.removeEventListener('pointermove', onScrubMove);
    window.removeEventListener('pointerup', onScrubEnd);
  }, [onScrubMove]);

  const onScrubStart = useCallback((e) => {
    e.stopPropagation();
    scrubbingRef.current = true;
    seekToClientX(e.clientX ?? e.touches?.[0]?.clientX);
    window.addEventListener('pointermove', onScrubMove);
    window.addEventListener('pointerup', onScrubEnd);
  }, [seekToClientX, onScrubMove, onScrubEnd]);

  const onTimelineHover = useCallback((e) => {
    const d = durRef.current;
    if (!d || !timelineRef.current || scrubbingRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    setTooltipX(x);
    setTooltipTime(fmtTime(pct * d));
    setShowTooltip(true);
  }, []);

  // Relative seek (arrow keys / double-tap) with a brief visual flash.
  const seekBy = useCallback((delta) => {
    const v = videoRef.current, d = durRef.current;
    if (!v || !d) return;
    v.currentTime = Math.max(0, Math.min(d, v.currentTime + delta));
    setProgress(v.currentTime);
    setSeekFlash(delta > 0 ? 'fwd' : 'back');
    setTimeout(() => setSeekFlash(null), 450);
  }, []);

  // Volume: setting a level above 0 also unmutes.
  const setVol = useCallback((val) => {
    const v = videoRef.current;
    const clamped = Math.max(0, Math.min(1, val));
    volRef.current = clamped;
    setVolume(clamped);
    if (v) {
      v.volume = clamped;
      v.muted = clamped === 0;
    }
    setMuted(clamped === 0);
  }, []);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    try {
      if (document.fullscreenElement || document.webkitFullscreenElement) {
        (document.exitFullscreen || document.webkitExitFullscreen).call(document);
      } else if (rootRef.current) {
        (rootRef.current.requestFullscreen || rootRef.current.webkitRequestFullscreen).call(rootRef.current);
      }
    } catch (_) {}
  }, []);

  // Download current item
  const triggerDownload = useCallback(() => {
    const item = lb.items[lb.index];
    if (!item) return;
    const isVid = item.type === 'video' || item.type === 'pov';
    const href = isVid ? previewPathFor(item.src) : item.src;
    const a = document.createElement('a');
    a.href = href;
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [lb.items, lb.index]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!lb.isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
        e.preventDefault(); e.stopPropagation(); onCloseRef.current(); return;
      }
      // With a video open, ←/→ scrub the clip (±5s) — item navigation
      // stays on the on-screen arrows + thumbnail strip. For photos they
      // page through the gallery as before.
      if (e.key === 'ArrowLeft') {
        if (videoActiveRef.current) { e.preventDefault(); seekBy(-5); }
        else { setNavDirection('left'); lb.prev(); }
        return;
      }
      if (e.key === 'ArrowRight') {
        if (videoActiveRef.current) { e.preventDefault(); seekBy(5); }
        else { setNavDirection('right'); lb.next(); }
        return;
      }
      if (e.key === 'j' || e.key === 'J') { e.preventDefault(); seekBy(-10); return; }
      if (e.key === 'l' || e.key === 'L') { e.preventDefault(); seekBy(10); return; }
      if (e.key === 'ArrowUp') { e.preventDefault(); setVol(volRef.current + 0.1); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setVol(volRef.current - 0.1); return; }
      if (e.key === 'm' || e.key === 'M') { e.preventDefault(); toggleMute(); return; }
      if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); return; }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFullscreen(); return; }
      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); triggerDownload(); return; }
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
  }, [lb.isOpen, lb.prev, lb.next, togglePlay, toggleFullscreen, triggerDownload, seekBy, setVol, toggleMute]);

  // Focus close button on open
  useEffect(() => {
    if (!lb.isOpen) return;
    try { closeBtnRef.current && closeBtnRef.current.focus({ preventScroll: true }); } catch (_) {}
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
      if (dx > 0) { setNavDirection('left'); lb.prev(); }
      else { setNavDirection('right'); lb.next(); }
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
  const modeClass = isVideo ? 'lightbox--video' : 'lightbox--photo';

  // Keep refs in sync so deps-free callbacks/listeners read fresh values.
  videoActiveRef.current = isVideo;
  durRef.current = duration;

  // Double-tap on a video's left/right half seeks ∓10s (mobile gesture).
  // Falls through to the single-tap play toggle when it's not a double tap.
  const onVideoTouchEnd = (e) => {
    const now = Date.now();
    const t = e.changedTouches[0];
    if (now - videoTapRef.current.t < 300) {
      const rect = e.currentTarget.getBoundingClientRect();
      const left = (t.clientX - rect.left) < rect.width / 2;
      seekBy(left ? -10 : 10);
      videoTapRef.current.t = 0;
      e.stopPropagation();
    } else {
      videoTapRef.current.t = now;
    }
  };

  // Metadata
  const cameraName = item.exif?.camera || (item.type === 'pov' ? 'Ray-Ban Meta' : 'DJI Mini 4 Pro');
  const isDrone = item.type === 'video' || item.type === 'photo';
  const resolution = isVideo ? '4K' : '48MP';

  // i18n labels
  const closeLabel = lang === 'es' ? 'Cerrar' : lang === 'it' ? 'Chiudi' : 'Close';
  const prevLabel = lang === 'es' ? 'Anterior' : lang === 'it' ? 'Precedente' : 'Previous';
  const nextLabel = lang === 'es' ? 'Siguiente' : lang === 'it' ? 'Successivo' : 'Next';
  const dlLabel = isVideo
    ? (lang === 'es' ? 'Descargar preview' : lang === 'it' ? 'Scarica preview' : 'Download preview')
    : (lang === 'es' ? 'Descargar' : lang === 'it' ? 'Scarica' : 'Download');
  const typeLabel = item.type === 'pov' ? 'POV' : isVideo ? 'Video' : 'Photo';

  const fmtTime = (s) => {
    if (!isFinite(s)) return '0:00';
    return `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  };

  const downloadHref = isVideo ? previewPathFor(item.src) : item.src;

  // Media animation class
  const mediaAnimClass = navDirection === 'right' ? ' lightbox-media--entering-right'
    : navDirection === 'left' ? ' lightbox-media--entering-left' : '';

  return (
    <div
      className={`lightbox-overlay ${phase === 'closing' ? 'lightbox-overlay--closing' : ''} ${phase === 'open' || phase === 'closing' ? 'lightbox-overlay--open' : ''} ${modeClass}`}
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop click to close */}
      <div className="lb-backdrop" onClick={onClose} aria-hidden="true" />

      {/* HEADER PREMIUM */}
      <div className="lightbox-header">
        <div className="lightbox-header__left">
          <span className="lightbox-counter">
            <span className="lightbox-counter__current">{lb.index + 1}</span>
            {' / '}{lb.items.length}
          </span>
          <span className={`type-badge--${isVideo ? 'video' : 'photo'}`}>
            {isVideo ? <Icon.videoType /> : <Icon.photoType />}
            {typeLabel}
          </span>
          {item.location?.flag && (
            <span className="category-badge">
              <span>{item.location.flag}</span>
              {locName}
            </span>
          )}
        </div>
        <div className="lightbox-header__right">
          <button
            ref={closeBtnRef}
            type="button"
            className="lightbox-close"
            onClick={onClose}
            aria-label={closeLabel}
            title={closeLabel}
          >
            <Icon.close />
          </button>
        </div>
      </div>

      {/* NAV ARROWS */}
      {lb.items.length > 1 && (
        <>
          <button type="button" className="lightbox-nav lightbox-nav--prev" onClick={goPrev} aria-label={prevLabel}><Icon.prev /></button>
          <button type="button" className="lightbox-nav lightbox-nav--next" onClick={goNext} aria-label={nextLabel}><Icon.next /></button>
        </>
      )}

      {/* CONTENT */}
      <div className="lightbox-content">
        {/* MEDIA STAGE */}
        <div className={`lightbox-media${mediaAnimClass}`} key={item.id}>
          {isVideo ? (
            <>
            {/* Ambient Mode glow — averaged frame colour bled behind the video.
                Sits outside the (overflow:hidden) wrap so it can spill past edges. */}
            <div className="lb-ambient-glow" ref={glowRef} aria-hidden="true" />
            <div className="lb-media-wrap lb-media-wrap--video">
              <video
                ref={videoRef}
                className="lb-media"
                src={item.src}
                poster={item.poster || undefined}
                crossOrigin="anonymous"
                disablePictureInPicture
                controlsList="nodownload nofullscreen noplaybackrate"
                autoPlay
                playsInline
                muted={muted}
                onClick={togglePlay}
                onDoubleClick={toggleFullscreen}
                onTouchEnd={onVideoTouchEnd}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onProgress={(e) => {
                  const v = e.currentTarget;
                  if (v.buffered.length > 0 && v.duration) {
                    setBuffered(v.buffered.end(v.buffered.length - 1) / v.duration);
                  }
                }}
              />
              {/* Buffering spinner */}
              {buffering && <div className="lb-spinner" aria-hidden="true"><span /></div>}
              {/* Seek flash (±10s) */}
              {seekFlash && (
                <div className={`lb-seek-flash lb-seek-flash--${seekFlash}`} aria-hidden="true">
                  {seekFlash === 'fwd' ? '10s »' : '« 10s'}
                </div>
              )}
              {/* Play overlay (visible when paused, hidden while buffering) */}
              <div className={`video-play-overlay${!playing && !buffering ? ' visible' : ''}`} onClick={togglePlay}>
                <Icon.playLarge />
              </div>
              {/* Premium video controls */}
              <div className="video-controls" onClick={(e) => e.stopPropagation()}>
                <button type="button" className="video-btn" onClick={togglePlay} aria-label={playing ? 'Pause' : 'Play'}>
                  {playing ? <Icon.pause /> : <Icon.play />}
                </button>
                <div
                  className="video-timeline"
                  ref={timelineRef}
                  onPointerDown={onScrubStart}
                  onMouseMove={onTimelineHover}
                  onMouseLeave={() => { if (!scrubbingRef.current) setShowTooltip(false); }}
                  role="slider"
                  aria-label="Seek"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(duration > 0 ? (progress / duration) * 100 : 0)}
                >
                  <div className="video-timeline__buffer" style={{ width: `${buffered * 100}%` }} />
                  <div className="video-timeline__progress" style={{ width: duration > 0 ? `${(progress / duration) * 100}%` : '0%' }} />
                  {showTooltip && (
                    <div className="video-timeline__tooltip" style={{ left: `${tooltipX}px` }}>{tooltipTime}</div>
                  )}
                </div>
                <span className="video-time">
                  <span className="video-time__current">{fmtTime(progress)}</span>
                  <span className="video-time__separator">/</span>
                  {fmtTime(duration || 0)}
                </span>
                {/* Volume: mute toggle + slider that expands on hover/focus */}
                <div className="video-volume">
                  <button type="button" className="video-btn" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
                    {muted ? <Icon.speakerOff /> : <Icon.speakerOn />}
                  </button>
                  <input
                    type="range"
                    className="video-volume__slider"
                    min={0} max={1} step={0.05}
                    value={muted ? 0 : volume}
                    onChange={(e) => setVol(parseFloat(e.target.value))}
                    aria-label="Volume"
                  />
                </div>
                <button type="button" className="video-btn" onClick={toggleFullscreen} aria-label="Fullscreen">
                  <Icon.fullscreen />
                </button>
              </div>
            </div>
            </>
          ) : (
            <div className="lb-media-wrap">
              <img className="lb-media" src={item.src} alt={title} />
            </div>
          )}
        </div>

        {/* FOOTER WITH METADATA */}
        <div className="lightbox-footer">
          <div className="lightbox-footer__info">
            <h3 className="lightbox-title">{title}</h3>
            <div className="lightbox-meta">
              {locName && <span className="lightbox-meta__item">{locName}</span>}
              {locName && item.year && <span className="lightbox-meta__separator" />}
              {item.year && <span className="lightbox-meta__item">{item.year}</span>}
              {cameraName && (
                <>
                  <span className="lightbox-meta__separator" />
                  <span className={`lightbox-meta__item${isDrone ? ' lightbox-meta__drone' : ''}`}>{cameraName}</span>
                </>
              )}
              <span className="lightbox-meta__separator" />
              <span className="lightbox-meta__resolution">{resolution}</span>
              {isVideo && duration > 0 && (
                <>
                  <span className="lightbox-meta__separator" />
                  <span className="lightbox-meta__item">{fmtTime(duration)}</span>
                </>
              )}
            </div>
          </div>
          <a href={downloadHref} download className="lightbox-download" onClick={(e) => e.stopPropagation()} aria-label={dlLabel}>
            <Icon.download /><span>{dlLabel}</span>
          </a>
        </div>

        {/* THUMBNAIL STRIP */}
        {lb.items.length > 1 && (
          <div className="lightbox-strip" ref={stripRef}>
            {lb.items.map((it, i) => {
              const thumbSrc = it.type === 'photo' ? it.src : (it.poster || it.src);
              const isActive = i === lb.index;
              const isVid = it.type === 'video' || it.type === 'pov';
              return (
                <button key={it.id} data-i={i} className={`strip-thumb${isActive ? ' strip-thumb--active' : ''}`} onClick={() => lb.goto(i)} aria-label={`Item ${i + 1}`}>
                  <img src={thumbSrc} loading="lazy" alt="" />
                  {isVid && (
                    <span className="strip-thumb__video-icon">
                      <svg viewBox="0 0 12 12" width="8" height="8" fill="currentColor"><path d="M3 2l7 4-7 4z"/></svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="lb-hint lb-hint-esc">{
        isVideo
          ? (lang === 'es' ? 'ESC cerrar · espacio play · ← → ±5s · M silenciar · F pantalla completa'
            : lang === 'it' ? 'ESC chiudi · spazio play · ← → ±5s · M muto · F schermo intero'
            : 'ESC close · space play · ← → ±5s · M mute · F fullscreen')
          : (lang === 'es' ? 'ESC cerrar · ← → navegar · F pantalla completa'
            : lang === 'it' ? 'ESC chiudi · ← → naviga · F schermo intero'
            : 'ESC close · ← → navigate · F fullscreen')
      }</div>
    </div>
  );
}

Object.assign(window, { LightboxProvider, useLightbox, Lightbox, lockBodyScroll, unlockBodyScroll });
