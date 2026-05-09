// Ranuk Orbit — Lightbox v3: robust close, 8s preview download for videos
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
// videos-drone/foo.mp4 → previews/foo.mp4
// videos-rayban/bar.mp4 → previews/bar.mp4
// If the preview is not registered in window.RANUK_ASSETS, fall back to the
// original source so the user never lands on a 404.
function previewPathFor(src) {
  if (!src) return src;
  const m = src.match(/media\/optimized\/(?:videos-drone|videos-rayban)\/(.+\.(?:mp4|mov))$/i);
  if (!m) return src;
  const previewPath = `media/optimized/previews/${m[1].replace(/\.(mov|MOV)$/i, '.mp4')}`;
  try {
    if (window.RANUK_ASSETS && window.RANUK_ASSETS.has(previewPath)) return previewPath;
  } catch (_) {}
  // Fallback: request a media fragment — browsers that honour the hint will
  // only fetch the first 8s. Those that don't, get the full file (still valid).
  return `${src}#t=0,8`;
}

function Lightbox() {
  const lb = useLightbox();
  const { lang } = useLang();
  const stripRef = useRef(null);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!lb.open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); lb.close(); }
      else if (e.key === 'ArrowLeft') lb.prev();
      else if (e.key === 'ArrowRight') lb.next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb.open, lb.close, lb.prev, lb.next]);

  // Failsafe: if the component unmounts while open, restore body scroll
  useEffect(() => () => { try { document.body.style.overflow = ''; } catch (_) {} }, []);

  // Scroll active thumb into view
  useEffect(() => {
    if (!lb.open || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-i="${lb.index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lb.index, lb.open]);

  // Mobile safety net: if user taps anywhere on the backdrop (the .lightbox
  // root itself, NOT the media/controls), close. Works around Safari quirks
  // where synthetic click on the close button doesn't fire after a video
  // fullscreen control dispatched first.
  const handleBackdrop = useCallback((e) => {
    if (e.target === rootRef.current) {
      e.preventDefault();
      lb.close();
    }
  }, [lb]);

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

  const downloadHref = isVideo ? previewPathFor(item.src) : item.src;

  // Fire-and-forget close. Fires on both click and touchend so iOS Safari
  // doesn't drop the event when native video controls were the previous
  // touch target.
  const closeAndStop = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    lb.close();
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
          onClick={closeAndStop}
          onTouchEnd={closeAndStop}
          aria-label={closeLabel}
        >
          <span aria-hidden="true">×</span>
          <span className="lb-close-label">{closeLabel}</span>
        </button>
      </div>

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
          <video
            key={item.id}
            className="lb-media"
            src={item.src}
            poster={item.poster || undefined}
            controls
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            autoPlay
            playsInline
          />
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
