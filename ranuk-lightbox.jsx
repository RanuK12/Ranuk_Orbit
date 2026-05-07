// Ranuk Orbit — Lightbox v2 with EXIF, filmstrip, download
const { createContext, useContext, useState, useCallback, useEffect, useRef } = React;

const LightboxContext = createContext(null);

function LightboxProvider({ children }) {
  const [state, setState] = useState({ items: [], index: 0, open: false });
  const open = useCallback((items, index = 0) => {
    setState({ items, index, open: true });
    document.body.style.overflow = 'hidden';
  }, []);
  const close = useCallback(() => {
    setState(s => ({ ...s, open: false }));
    document.body.style.overflow = '';
  }, []);
  const prev = useCallback(() => setState(s => ({ ...s, index: (s.index - 1 + s.items.length) % s.items.length })), []);
  const next = useCallback(() => setState(s => ({ ...s, index: (s.index + 1) % s.items.length })), []);
  const goto = useCallback((i) => setState(s => ({ ...s, index: i })), []);
  return (
    <LightboxContext.Provider value={{ ...state, open, close, prev, next, goto }}>
      {children}
    </LightboxContext.Provider>
  );
}
function useLightbox() { return useContext(LightboxContext); }

function Lightbox() {
  const lb = useLightbox();
  const { lang } = useLang();
  const stripRef = useRef(null);

  useEffect(() => {
    if (!lb.open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') lb.close();
      if (e.key === 'ArrowLeft') lb.prev();
      if (e.key === 'ArrowRight') lb.next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lb.open, lb.close, lb.prev, lb.next]);

  // Scroll active thumb into view
  useEffect(() => {
    if (!lb.open || !stripRef.current) return;
    const el = stripRef.current.querySelector(`[data-i="${lb.index}"]`);
    if (el) el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [lb.index, lb.open]);

  if (!lb.open || !lb.items.length) return null;
  const item = lb.items[lb.index];
  const title = item._displayTitle || pick(item.title, lang) || '';
  const isVideo = item.type === 'video' || item.type === 'pov';
  const exif = item.exif || {};
  const locName = item.location ? pick(item.location.name, lang) : '';

  // Click handler robusto: cierra solo si el click fue en el backdrop directo (no en stage ni botones)
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) lb.close();
  };
  // Handler para botones, dispara onPointerDown para responder antes que video controls capturen el evento
  const closeHandler = (e) => { e.preventDefault(); e.stopPropagation(); lb.close(); };
  const prevHandler = (e) => { e.preventDefault(); e.stopPropagation(); lb.prev(); };
  const nextHandler = (e) => { e.preventDefault(); e.stopPropagation(); lb.next(); };

  return (
    <div className="lightbox" onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <button type="button" className="lb-close" onPointerDown={closeHandler} onClick={closeHandler} aria-label="Close">×</button>
      <button type="button" className="lb-nav lb-nav-prev" onPointerDown={prevHandler} onClick={prevHandler} aria-label="Prev">‹</button>
      <button type="button" className="lb-nav lb-nav-next" onPointerDown={nextHandler} onClick={nextHandler} aria-label="Next">›</button>

      <div className="lb-stage" onClick={(e) => e.stopPropagation()}>
        {isVideo ? (
          <video
            key={item.id}
            className="lb-media"
            src={item.src}
            controls autoPlay playsInline
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
            <a href={item.src} download className="lb-download">↓ Download original</a>
            <span className="lb-counter">{lb.index + 1} / {lb.items.length}</span>
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
