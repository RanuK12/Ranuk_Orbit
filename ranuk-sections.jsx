// Ranuk Orbit — All remaining sections, aligned with existing ranuk-i18n.jsx + ranuk-data.js schemas
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// Lang hook in this codebase exposes { lang, change, t }
function useChangeLang() {
  const ctx = useLang();
  return { lang: ctx.lang, t: ctx.t, setLang: ctx.change };
}

// ─── NAV ──────────────────────────────────────────────────────────────────
const LANG_OPTIONS = [
  { code: 'en', label: 'EN', full: 'English' },
  { code: 'es', label: 'ES', full: 'Español' },
  { code: 'it', label: 'IT', full: 'Italiano' },
];

function LangDropdown({ lang, setLang, variant }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);
  const current = LANG_OPTIONS.find(o => o.code === lang) || LANG_OPTIONS[0];
  return (
    <div className={`lang-dd${variant ? ' is-' + variant : ''}`} ref={ref}>
      <button
        type="button"
        className="lang-dd-toggle"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Idioma: ${current.full}`}
      >
        <span>{variant === 'overlay' ? current.full : current.label}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 4l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && (
        <ul className="lang-dd-menu" role="listbox">
          {LANG_OPTIONS.map(o => (
            <li key={o.code}>
              <button
                type="button"
                role="option"
                aria-selected={o.code === lang}
                className={o.code === lang ? 'is-active' : ''}
                onClick={() => { setLang(o.code); setOpen(false); }}
              >
                <span className="lang-dd-code">{o.label}</span>
                <span className="lang-dd-full">{o.full}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Nav() {
  const { t, lang, setLang } = useChangeLang();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const links = [
    { href: '#atlas', label: t.nav.explore },
    { href: '#archive', label: t.nav.archive },
    { href: '#story', label: t.nav.story },
    { href: '#services', label: t.nav.services },
    { href: '#contact', label: t.nav.contact },
  ];

  return (
    <>
      <nav className={`nav${scrolled ? ' is-scrolled' : ''}`}>
        <a href="#home" className="nav-brand" aria-label="Ranuk Orbit">
          <span className="nav-mark">⊕</span>
          <span className="nav-wordmark">Ranuk Orbit</span>
        </a>
        <div className="nav-links">
          {links.map(l => <a key={l.href} href={l.href} className="nav-link">{l.label}</a>)}
        </div>
        <div className="nav-actions">
          <LangDropdown lang={lang} setLang={setLang} />
          <button className="nav-burger" onClick={() => setOpen(true)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {open && (
        <div className="nav-overlay" role="dialog" aria-modal="true">
          <button className="nav-overlay-close" onClick={() => setOpen(false)}>×</button>
          <div className="nav-overlay-links">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="nav-overlay-foot">
            <LangDropdown lang={lang} setLang={setLang} variant="overlay" />
          </div>
        </div>
      )}
    </>
  );
}

// ─── REEL MODAL ────────────────────────────────────────────────────────
// Dedicated fullscreen player for the "Watch the reel" CTA. NOT an archive
// item — it's a standalone highlight compilation. If window.RANUK_REEL_URL
// is set (e.g. '/media/optimized/reel.mp4'), plays that video. Otherwise
// shows a "coming soon" card so the button never falls through silently.
function ReelModal({ open, onClose }) {
  const { lang } = useChangeLang();
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const reelUrl = typeof window !== 'undefined' ? window.RANUK_REEL_URL : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } };
    window.addEventListener('keydown', onKey);
    try { document.body.style.overflow = 'hidden'; } catch (_) {}
    return () => {
      window.removeEventListener('keydown', onKey);
      try { document.body.style.overflow = ''; } catch (_) {}
      try {
        const v = videoRef.current;
        if (v) { v.pause(); v.currentTime = 0; }
      } catch (_) {}
      try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
    };
  }, [open, onClose]);

  if (!open) return null;

  const copy = {
    es: {
      title: 'The Reel',
      sub: 'Tres años, una órbita — compilado de highlights.',
      soon_title: 'Próximamente',
      soon_body: 'Estoy editando un reel de 90 segundos con los mejores momentos de Cerdeña, los Alpes, Patagonia, Marruecos y Tailandia. Mientras tanto, podés entrar al Atlas y ver los lugares uno por uno.',
      close: 'Cerrar',
      explore: 'Explorar el Atlas',
      esc: 'ESC para cerrar',
    },
    en: {
      title: 'The Reel',
      sub: 'Three years, one orbit — a highlights compilation.',
      soon_title: 'Coming soon',
      soon_body: "I'm editing a 90-second reel with the best moments from Sardinia, the Alps, Patagonia, Morocco and Thailand. In the meantime, you can explore the Atlas and visit each place one by one.",
      close: 'Close',
      explore: 'Explore the Atlas',
      esc: 'ESC to close',
    },
    it: {
      title: 'The Reel',
      sub: 'Tre anni, un\'orbita — una compilation di highlight.',
      soon_title: 'Prossimamente',
      soon_body: 'Sto montando un reel di 90 secondi con i migliori momenti di Sardegna, Alpi, Patagonia, Marocco e Thailandia. Nel frattempo, puoi esplorare l\'Atlante e visitare ogni luogo.',
      close: 'Chiudi',
      explore: 'Esplora l\'Atlante',
      esc: 'ESC per chiudere',
    },
  }[lang] || { title: 'The Reel', sub: '', soon_title: 'Coming soon', soon_body: '', close: 'Close', explore: 'Explore', esc: 'ESC' };

  const handleBackdrop = (e) => { if (e.target === dialogRef.current) onClose(); };

  return (
    <div
      className="reel-modal"
      ref={dialogRef}
      onClick={handleBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
    >
      <div className="reel-modal-inner">
        <header className="reel-modal-head">
          <div>
            <span className="reel-modal-kicker">Ranuk Orbit</span>
            <h2 className="reel-modal-title">{copy.title}</h2>
            <p className="reel-modal-sub">{copy.sub}</p>
          </div>
          <button
            type="button"
            className="reel-modal-close"
            onClick={onClose}
            aria-label={copy.close}
          >
            <span aria-hidden="true">×</span>
            <span className="reel-modal-close-label">{copy.close}</span>
          </button>
        </header>

        <div className="reel-modal-stage">
          {reelUrl ? (
            <video
              ref={videoRef}
              className="reel-modal-video"
              src={reelUrl}
              autoPlay
              playsInline
              controls
              controlsList="nodownload"
            />
          ) : (
            <div className="reel-modal-soon">
              <div className="reel-modal-soon-mark">⊕</div>
              <h3>{copy.soon_title}</h3>
              <p>{copy.soon_body}</p>
              <a href="#explore" className="reel-modal-cta" onClick={onClose}>
                {copy.explore} <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
        </div>

        <footer className="reel-modal-foot">
          <span>{copy.esc}</span>
        </footer>
      </div>
    </div>
  );
}

// ─── ARCHIVE / GALLERY V2 ─────────────────────────────────────────────────
// Detect reduced motion once — modules may read this synchronously
const _prefersReducedMotion = () => {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (_) { return false; }
};

// Memoized tile: only mounts a <video> element when the user is hovering
// the card; idle state stays as a cheap <img poster>. Uses an
// IntersectionObserver so off-screen tiles never allocate DOM for the video.
function GalleryTile({ item, index, className, thumb, displayName, onOpen }) {
  const ref = useRef(null);
  const videoRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [active, setActive] = useState(false); // hover desktop / tap mobile
  const isVideo = item.type !== 'photo';

  useEffect(() => {
    if (!ref.current || !isVideo) return;
    const obs = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
      // Pause videos when they scroll out — crucial on mobile Safari
      if (!entry.isIntersecting && videoRef.current) {
        try { videoRef.current.pause(); } catch (_) {}
      }
    }, { rootMargin: '200px 0px' });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [isVideo]);

  const onEnter = useCallback(() => {
    if (_prefersReducedMotion()) return;
    setActive(true);
    // Schedule play on next tick so React mounts the <video> first
    requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      if (!v.src) v.src = item.src;
      v.play().catch(() => {});
    });
  }, [item.src]);

  const onLeave = useCallback(() => {
    const v = videoRef.current;
    if (v) { try { v.pause(); v.currentTime = 0; } catch (_) {} }
    setActive(false);
  }, []);

  return (
    <button
      ref={ref}
      data-id={item.id}
      className={className}
      onClick={onOpen}
      onMouseEnter={isVideo ? onEnter : undefined}
      onMouseLeave={isVideo ? onLeave : undefined}
      style={{ ['--accent']: item.location.accentColor }}
    >
      {/* Poster layer — always present, cheap cost (img) */}
      <img
        src={thumb}
        alt={item._displayTitle}
        loading="lazy"
        decoding="async"
        className="gallery-thumb"
      />
      {/* Video layer — only mounted when in-view AND user hovers */}
      {isVideo && inView && active && (
        <video
          ref={videoRef}
          className="gallery-video"
          muted loop playsInline
          preload="none"
          poster={item.poster}
        />
      )}
      <div className="gallery-overlay">
        <div className="gallery-meta">
          <span className="gallery-flag">{item.location.flag}</span>
          <div className="gallery-meta-text">
            <h4>{item._displayTitle}</h4>
            <p>{displayName} · {item.year}</p>
          </div>
        </div>
        {isVideo && <span className="gallery-play">▶</span>}
      </div>
    </button>
  );
}

function ArchiveSection() {
  const { t, lang } = useChangeLang();
  const lb = useLightbox();
  const [filter, setFilter] = useState('all'); // all | drone | pov | photo
  const [year, setYear] = useState('all');
  const [place, setPlace] = useState('all'); // locationId | all
  const [mood, setMood] = useState('all');   // oceanic | golden | cold | warm | green | all
  const [altitude, setAltitude] = useState('all'); // aerial | mountain | street | water | all
  const [advOpen, setAdvOpen] = useState(false); // toggles the mood/altitude chip row
  const containerRef = useRef(null);

  const allItems = useMemo(() => {
    const items = [];
    (window.LOCATIONS_V2 || []).forEach(loc => {
      (loc.media || []).forEach(m => {
        items.push({
          ...m,
          locationId: loc.id,
          location: { name: loc.name, country: loc.country, flag: loc.flag, accentColor: loc.accentColor },
          year: m.year || loc.year,
          _displayTitle: pick(m.title, lang),
        });
      });
    });
    return items;
  }, [lang]);

  const filtered = useMemo(() => {
    return allItems.filter(it => {
      if (year !== 'all' && String(it.year) !== String(year)) return false;
      if (place !== 'all' && it.locationId !== place) return false;
      if (mood !== 'all' && it.mood !== mood) return false;
      if (altitude !== 'all' && it.altitude !== altitude) return false;
      if (filter === 'all') return true;
      if (filter === 'drone') return it.type === 'video' || (it.type === 'photo' && it.src && it.src.includes('fotos-drone'));
      if (filter === 'pov') return it.type === 'pov';
      if (filter === 'photo') return it.type === 'photo';
      return true;
    });
  }, [allItems, filter, year, place, mood, altitude]);

  // FLIP animation on filter change
  const prevRectsRef = useRef(new Map());
  useEffect(() => {
    if (!containerRef.current) return;
    const els = containerRef.current.querySelectorAll('.gallery-item');
    const newRects = new Map();
    els.forEach(el => newRects.set(el.dataset.id, el.getBoundingClientRect()));
    prevRectsRef.current.forEach((prev, id) => {
      const next = newRects.get(id);
      if (!next) return;
      const dx = prev.left - next.left;
      const dy = prev.top - next.top;
      if (dx === 0 && dy === 0) return;
      const el = containerRef.current.querySelector(`[data-id="${id}"]`);
      if (!el) return;
      el.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }],
        { duration: 460, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
      );
    });
    prevRectsRef.current = newRects;
  }, [filtered]);

  const years = useMemo(() => {
    const s = new Set();
    allItems.forEach(it => it.year && s.add(it.year));
    return Array.from(s).sort((a, b) => b - a);
  }, [allItems]);

  // Distinct places / moods / altitudes present in the dataset, computed
  // ONCE (not filtered) so the user can always choose any axis regardless
  // of the current filter selection. Each chip shows a live count of how
  // many items match *after* the current filter stack, so the user sees
  // which combinations produce results.
  const places = useMemo(() => {
    const byId = new Map();
    allItems.forEach(it => {
      if (!byId.has(it.locationId)) {
        byId.set(it.locationId, { id: it.locationId, name: it.location.name, flag: it.location.flag, count: 0 });
      }
    });
    return Array.from(byId.values());
  }, [allItems]);

  const moods = useMemo(() => {
    const s = new Set();
    allItems.forEach(it => it.mood && s.add(it.mood));
    return Array.from(s).sort();
  }, [allItems]);

  const altitudes = useMemo(() => {
    const s = new Set();
    allItems.forEach(it => it.altitude && s.add(it.altitude));
    return Array.from(s).sort();
  }, [allItems]);

  const openItem = useCallback((idx) => { lb.open(filtered, idx); }, [filtered, lb]);

  // Local copy for chip labels so we don't depend on i18n strings that
  // may be missing in some locales (mood/altitude were not in v1 i18n).
  const moodCopy = {
    oceanic:  { es: 'Oceánico', en: 'Oceanic', it: 'Oceanico' },
    golden:   { es: 'Dorado',    en: 'Golden',  it: 'Dorato'   },
    cold:     { es: 'Frío',      en: 'Cold',    it: 'Freddo'   },
    warm:     { es: 'Cálido',    en: 'Warm',    it: 'Caldo'    },
    green:    { es: 'Verde',     en: 'Green',   it: 'Verde'    },
  };
  const altCopy = {
    aerial:   { es: 'Aéreo',      en: 'Aerial',   it: 'Aereo'     },
    mountain: { es: 'Montaña',    en: 'Mountain', it: 'Montagna'  },
    street:   { es: 'Calle',      en: 'Street',   it: 'Strada'    },
    water:    { es: 'Agua',       en: 'Water',    it: 'Acqua'     },
  };
  const uiCopy = {
    place:       { es: 'Lugar',        en: 'Place',       it: 'Luogo' },
    mood:        { es: 'Atmósfera',    en: 'Mood',        it: 'Atmosfera' },
    altitude:    { es: 'Altitud',      en: 'Altitude',    it: 'Altitudine' },
    all_places:  { es: 'Todos los lugares', en: 'All places', it: 'Tutti i luoghi' },
    all_moods:   { es: 'Todos',        en: 'Any',         it: 'Tutti' },
    all_alts:    { es: 'Todos',        en: 'Any',         it: 'Tutti' },
    more:        { es: 'Más filtros',  en: 'More filters', it: 'Altri filtri' },
    less:        { es: 'Menos filtros',en: 'Fewer filters', it: 'Meno filtri' },
    reset:       { es: 'Limpiar',      en: 'Reset',       it: 'Reset' },
  };
  const txt = (k) => (uiCopy[k] && uiCopy[k][lang]) || (uiCopy[k] && uiCopy[k].en) || k;
  const moodTxt = (m) => (moodCopy[m] && moodCopy[m][lang]) || m;
  const altTxt  = (a) => (altCopy[a]  && altCopy[a][lang])  || a;

  const anyAdvActive = mood !== 'all' || altitude !== 'all' || place !== 'all';
  const resetAll = () => { setFilter('all'); setYear('all'); setPlace('all'); setMood('all'); setAltitude('all'); };

  return (
    <section className="archive" id="archive">
      <div className="archive-head">
        <span className="section-overline">{t.archive.overline}</span>
        <h2 className="section-title">{t.archive.title}</h2>
        <p className="section-sub">{t.archive.sub}</p>
      </div>

      <div className="archive-controls">
        <div className="archive-filters">
          {[
            { id: 'all', label: t.archive.filters.all },
            { id: 'drone', label: t.archive.filters.drone },
            { id: 'pov', label: t.archive.filters.pov },
            { id: 'photo', label: t.archive.filters.photo },
          ].map(f => (
            <button
              key={f.id}
              className={`chip${filter === f.id ? ' is-active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="archive-years">
          <button className={`chip chip-year${year === 'all' ? ' is-active' : ''}`} onClick={() => setYear('all')}>
            {t.atlas.year_all}
          </button>
          {years.map(y => (
            <button key={y} className={`chip chip-year${year === y ? ' is-active' : ''}`} onClick={() => setYear(y)}>
              {y}
            </button>
          ))}
        </div>

        {/* Place filter: one chip per location with material */}
        <div className="archive-places" role="group" aria-label={txt('place')}>
          <span className="archive-filter-label">{txt('place')}</span>
          <button
            className={`chip chip-place${place === 'all' ? ' is-active' : ''}`}
            onClick={() => setPlace('all')}
          >
            {txt('all_places')}
          </button>
          {places.map(p => (
            <button
              key={p.id}
              className={`chip chip-place${place === p.id ? ' is-active' : ''}`}
              onClick={() => setPlace(p.id)}
            >
              <span className="chip-flag">{p.flag}</span>
              {pick(p.name, lang)}
            </button>
          ))}
        </div>

        {/* Toggleable advanced row (mood + altitude) — these exist in the
            data model since v2 but were not exposed. Collapsed by default
            to keep the filter bar clean; visible when user wants to
            browse cinematographically. */}
        <div className="archive-more-row">
          <button
            type="button"
            className={`chip chip-toggle${advOpen || anyAdvActive ? ' is-active' : ''}`}
            onClick={() => setAdvOpen(o => !o)}
            aria-expanded={advOpen || anyAdvActive}
          >
            {advOpen || anyAdvActive ? txt('less') : txt('more')}
          </button>
          {(filter !== 'all' || year !== 'all' || anyAdvActive) && (
            <button type="button" className="chip chip-reset" onClick={resetAll}>
              {txt('reset')} ×
            </button>
          )}
        </div>

        {(advOpen || anyAdvActive) && (
          <>
            <div className="archive-moods" role="group" aria-label={txt('mood')}>
              <span className="archive-filter-label">{txt('mood')}</span>
              <button
                className={`chip chip-mood${mood === 'all' ? ' is-active' : ''}`}
                onClick={() => setMood('all')}
              >
                {txt('all_moods')}
              </button>
              {moods.map(m => (
                <button
                  key={m}
                  className={`chip chip-mood chip-mood--${m}${mood === m ? ' is-active' : ''}`}
                  onClick={() => setMood(m)}
                >
                  <span className={`chip-dot chip-dot--${m}`} aria-hidden="true" />
                  {moodTxt(m)}
                </button>
              ))}
            </div>
            <div className="archive-altitudes" role="group" aria-label={txt('altitude')}>
              <span className="archive-filter-label">{txt('altitude')}</span>
              <button
                className={`chip chip-alt${altitude === 'all' ? ' is-active' : ''}`}
                onClick={() => setAltitude('all')}
              >
                {txt('all_alts')}
              </button>
              {altitudes.map(a => (
                <button
                  key={a}
                  className={`chip chip-alt chip-alt--${a}${altitude === a ? ' is-active' : ''}`}
                  onClick={() => setAltitude(a)}
                >
                  {altTxt(a)}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <ArchiveGallery
        filtered={filtered}
        filterActive={filter !== 'all' || year !== 'all' || place !== 'all' || mood !== 'all' || altitude !== 'all'}
        onOpen={openItem}
        lang={lang}
        containerRef={containerRef}
        locationsMap={useMemo(() => {
          const map = {};
          (window.LOCATIONS_V2 || []).forEach(loc => { map[loc.id] = loc; });
          return map;
        }, [])}
      />

      {filtered.length === 0 && (
        <div className="archive-empty">{t.archive.empty}</div>
      )}
    </section>
  );
}

// ─── ARCHIVE GALLERY (grouped by location, flat when filtered) ───────────
// Two render modes:
//   - GROUPED: default view. One section per location. Shows up to
//     INITIAL_PER_GROUP items per location; a "Show all (N)" button expands
//     the rest inline. Kills the "scroll forever" problem without hiding
//     content from the user.
//   - FLAT: when the user applies a filter (year/place/mood/altitude/
//     type ≠ all), we already narrowed the set, so a flat masonry is what
//     the user expects. Same GalleryTile component reused.
const INITIAL_PER_GROUP = 6;   // first 6 items per location visible by default
const RAYBAN_INITIAL = 12;     // Rayban/POV section is already fine — keep it loose

function ArchiveGallery({ filtered, filterActive, onOpen, lang, containerRef, locationsMap }) {
  // FLAT mode: simple masonry, no grouping.
  if (filterActive) {
    return (
      <div className="gallery-masonry" ref={containerRef}>
        {filtered.map((it, i) => {
          const spotlight = (i + 1) % 5 === 0;
          const fallback = it._posterMatch === 'fallback' ? ' is-fallback-poster' : '';
          const cls = `gallery-item${spotlight ? ' is-spotlight' : ''} gallery-item--${it.type}${fallback}`;
          const thumb = it.type === 'photo' ? it.src : (it.poster || it.src);
          return (
            <GalleryTile
              key={it.id}
              item={it}
              index={i}
              className={cls}
              thumb={thumb}
              displayName={pick(it.location.name, lang)}
              onOpen={() => onOpen(i)}
            />
          );
        })}
      </div>
    );
  }

  // GROUPED mode: one card per location.
  return (
    <div className="archive-groups" ref={containerRef}>
      {(() => {
        // Preserve the order of LOCATIONS_V2 (already hand-curated).
        const groups = new Map();
        filtered.forEach((it, globalIdx) => {
          if (!groups.has(it.locationId)) groups.set(it.locationId, []);
          groups.get(it.locationId).push({ ...it, _globalIdx: globalIdx });
        });
        return Array.from(groups.entries()).map(([locId, items]) => (
          <ArchiveGroup
            key={locId}
            loc={locationsMap[locId]}
            items={items}
            onOpen={onOpen}
            lang={lang}
          />
        ));
      })()}
    </div>
  );
}

function ArchiveGroup({ loc, items, onOpen, lang }) {
  const [expanded, setExpanded] = useState(false);
  if (!loc) return null;

  const copy = {
    es: { show_all: 'Ver los', items: 'items', collapse: 'Ocultar', more: 'más' },
    en: { show_all: 'Show all', items: 'items', collapse: 'Collapse', more: 'more' },
    it: { show_all: 'Mostra tutti', items: 'elementi', collapse: 'Riduci', more: 'altri' },
  }[lang] || { show_all: 'Show all', items: 'items', collapse: 'Collapse', more: 'more' };

  const over = items.length > INITIAL_PER_GROUP;
  const visible = expanded ? items : items.slice(0, INITIAL_PER_GROUP);
  const hiddenCount = items.length - INITIAL_PER_GROUP;

  return (
    <section
      className="archive-group"
      style={{ ['--accent']: loc.accentColor }}
      aria-labelledby={`grp-${loc.id}`}
    >
      <header className="archive-group-head">
        <div className="archive-group-title">
          <span className="archive-group-flag">{loc.flag}</span>
          <div>
            <h3 id={`grp-${loc.id}`} className="archive-group-name">{pick(loc.name, lang)}</h3>
            <p className="archive-group-meta">
              <span>{pick(loc.country, lang)}</span>
              <span className="archive-group-dot">·</span>
              <span>{loc.year}</span>
              <span className="archive-group-dot">·</span>
              <span className="archive-group-count">{items.length} {copy.items}</span>
            </p>
          </div>
        </div>
      </header>

      <div className="archive-group-grid">
        {visible.map((it, i) => {
          const cls = `gallery-item gallery-item--${it.type}${it._posterMatch === 'fallback' ? ' is-fallback-poster' : ''}`;
          const thumb = it.type === 'photo' ? it.src : (it.poster || it.src);
          return (
            <GalleryTile
              key={it.id}
              item={it}
              index={i}
              className={cls}
              thumb={thumb}
              displayName={pick(it.location.name, lang)}
              onOpen={() => onOpen(it._globalIdx)}
            />
          );
        })}
      </div>

      {over && (
        <div className="archive-group-foot">
          <button
            type="button"
            className="archive-group-toggle"
            onClick={() => setExpanded(e => !e)}
            aria-expanded={expanded}
          >
            {expanded
              ? <>↑ {copy.collapse}</>
              : <>+ {copy.show_all} <b>{hiddenCount}</b> {copy.more}</>
            }
          </button>
        </div>
      )}
    </section>
  );
}

// ─── STORY V2 ─────────────────────────────────────────────────────────────
function CountUp({ to, duration = 1800, suffix = '' }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const startedRef = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const animate = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      const start = performance.now();
      const tick = (now) => {
        const tt = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - tt, 3);
        setVal(Math.round(eased * to));
        if (tt < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    // If already intersecting at mount (e.g. navigated directly to anchor),
    // skip the observer and animate right away.
    try {
      const r = ref.current.getBoundingClientRect();
      const inView = r.top < window.innerHeight && r.bottom > 0;
      if (inView) { animate(); return () => rafRef.current && cancelAnimationFrame(rafRef.current); }
    } catch (_) {}

    // Lowered threshold from 0.4 → 0.01 so short viewports (mobile landscape,
    // split screens) still trigger. Also use rootMargin so we start just
    // before the element scrolls in.
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      animate();
      obs.disconnect();
    }, { threshold: 0.01, rootMargin: '0px 0px -10% 0px' });
    obs.observe(ref.current);

    return () => {
      obs.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [to, duration]);

  // Reset when `to` changes (e.g. language switch re-renders), so the
  // counter restarts from 0 and lands on the new value.
  useEffect(() => {
    startedRef.current = false;
    setVal(0);
  }, [to]);

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function ProfileRotator() {
  const photos = window.PROFILE_PHOTOS || [];
  const [idx, setIdx] = useState(0);

  // Rotate every 10s. Crossfade is done in CSS via .is-active.
  useEffect(() => {
    if (photos.length < 2) return;
    const id = setInterval(() => setIdx(i => (i + 1) % photos.length), 10000);
    return () => clearInterval(id);
  }, [photos.length]);

  // Preload the next image so the crossfade never flashes a half-loaded frame.
  useEffect(() => {
    if (photos.length < 2) return;
    const next = photos[(idx + 1) % photos.length];
    const img = new Image();
    img.decoding = 'async';
    img.src = next;
  }, [idx, photos]);

  if (photos.length === 0) return null;

  return (
    <div className="profile-rotator" aria-label="Emilio Ranucoli">
      {photos.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className={`profile-photo${i === idx ? ' is-active' : ''}`}
          loading={i < 2 ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={i === 0 ? 'high' : 'auto'}
        />
      ))}
    </div>
  );
}

function StorySection() {
  const { t, lang } = useChangeLang();
  const s = window.STATS_V2 || {};
  // Same 4 stats as StatsBand (Atlas) → guarantees the numbers under the
  // story always match the ones above. Suffix "+" for growth metrics, none
  // for fixed totals, mirroring StatsBand exactly.
  const storyLabels = (t.story && t.story.stat_labels) || {};
  const bandLabels = {
    es: { countries: 'países', flights: 'vuelos', hours: 'horas en el aire', brands: 'marcas' },
    en: { countries: 'countries', flights: 'flights', hours: 'hours airborne', brands: 'brands' },
    it: { countries: 'paesi', flights: 'voli', hours: 'ore in volo', brands: 'brand' },
  };
  const L = bandLabels[lang] || bandLabels.es;
  // Prefer the short story label if defined, otherwise the StatsBand label.
  const labelFor = (key, fallback) => (storyLabels[key] || fallback);
  const stats = [
    { value: s.countries || 0, suffix: '',  label: labelFor('countries', L.countries) },
    { value: s.flights   || 0, suffix: '+', label: L.flights },
    { value: s.hours_flown || 0, suffix: '+', label: labelFor('hours', L.hours) },
    { value: s.projects  || 0, suffix: '',  label: labelFor('projects', L.brands) },
  ];
  return (
    <section className="story" id="story">
      <div className="story-grain" aria-hidden="true" />
      <div className="story-grid">
        <div className="story-portrait">
          <ProfileRotator />
          <span className="story-portrait-caption">{t.story.sub}</span>
        </div>
        <div className="story-text">
          <span className="section-overline">{t.story.overline}</span>
          <h2 className="section-title story-title">{t.story.title}</h2>
          <div className="story-paragraphs">
            {(t.story.paragraphs || []).map((p, i) => (
              <p key={i} className="story-p">{p}</p>
            ))}
          </div>
          <blockquote className="story-quote">
            <span className="story-quote-mark">"</span>
            {t.story.pull}
          </blockquote>
        </div>
      </div>
      <div className="story-stats">
        {stats.map((s, i) => (
          <div key={i} className="story-stat">
            <div className="story-stat-num"><CountUp to={s.value} suffix={s.suffix || ''} /></div>
            <div className="story-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── SERVICES V2 ──────────────────────────────────────────────────────────
function ServicesSection() {
  const { t, lang } = useChangeLang();
  const [openFaq, setOpenFaq] = useState(null);
  const packages = t.services.packages || [];

  return (
    <section className="services" id="services">
      <div className="services-head">
        <span className="section-overline">{t.services.overline}</span>
        <h2 className="section-title">{t.services.title}</h2>
        <p className="section-sub">{t.services.sub}</p>
      </div>

      <div className="services-grid">
        {packages.map((pkg, i) => (
          <div key={i} className={`service-card${pkg.popular ? ' is-popular' : ''}${pkg.tag === 'Bespoke' || pkg.tag === 'A medida' ? ' is-custom' : ''}`}>
            {pkg.popular && <span className="service-ribbon">★</span>}
            <span className="service-tagline">{pkg.tag}</span>
            <h3 className="service-name">{pkg.title}</h3>
            <div className="service-price">{pkg.price} <span className="service-unit">{pkg.unit}</span></div>
            <p className="service-desc">{pkg.desc}</p>
            <ul className="service-features">
              {(pkg.features || []).map((f, j) => <li key={j}>{f}</li>)}
            </ul>
            <a href="#contact" className="service-cta">
              {t.services.cta} <span>→</span>
            </a>
          </div>
        ))}
      </div>

      <div className="services-faq">
        <span className="section-overline" style={{ display: 'block', textAlign: 'center', marginBottom: 8 }}>{t.services.faq_overline}</span>
        <h3 className="faq-title">{t.services.faq_title}</h3>
        <div className="faq-list">
          {(window.FAQ_V2 || []).map((q, i) => {
            const isOpen = openFaq === i;
            return (
              <div key={i} className={`faq-item${isOpen ? ' is-open' : ''}`}>
                <button className="faq-q" onClick={() => setOpenFaq(isOpen ? null : i)}>
                  <span>{pick(q.q, lang)}</span>
                  <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                </button>
                <div className="faq-a">
                  <p>{pick(q.a, lang)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── RAY-BAN META POV V2 ──────────────────────────────────────────────────
function PovLens({ visible, pool, startIdx }) {
  const [idx, setIdx] = useState(startIdx);
  const [prevIdx, setPrevIdx] = useState(null);
  const reducedMotion = _prefersReducedMotion();

  useEffect(() => {
    if (!pool || pool.length < 2 || reducedMotion) return;
    const id = setInterval(() => {
      setPrevIdx(idx);
      setIdx(i => (i + 2) % pool.length);
    }, 15000);
    return () => clearInterval(id);
  }, [pool, idx, reducedMotion]);

  if (!pool || pool.length === 0) return <div className="rayban-lens" />;
  const cur = pool[idx % pool.length];
  const prev = prevIdx != null ? pool[prevIdx % pool.length] : null;

  // Not visible yet, or reducedMotion: just show the poster image.
  if (!visible || reducedMotion) {
    return (
      <div className="rayban-lens">
        <img src={cur.poster} alt="" className="rayban-lens-video is-cur" loading="lazy" decoding="async" />
      </div>
    );
  }

  return (
    <div className="rayban-lens">
      {prev && (
        <video
          key={`prev-${prev.id}`}
          src={prev.src}
          poster={prev.poster}
          muted loop playsInline autoPlay
          preload="metadata"
          className="rayban-lens-video is-prev"
        />
      )}
      <video
        key={`cur-${cur.id}`}
        src={cur.src}
        poster={cur.poster}
        muted loop playsInline autoPlay
        preload="metadata"
        className="rayban-lens-video is-cur"
      />
    </div>
  );
}

function RayBanSection() {
  const { t, lang } = useChangeLang();
  const lb = useLightbox();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [glassesVisible, setGlassesVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setGlassesVisible(true); obs.disconnect(); } },
      { rootMargin: '100px' }
    );
    obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  // Aggregate every POV item (not just 6 as in v2) so the marquee can
  // show 12 tiles with rotation — gives the section real body.
  const allPov = useMemo(() => {
    const items = [];
    (window.LOCATIONS_V2 || []).forEach(loc => {
      (loc.media || []).forEach(m => {
        if (m.type === 'pov') items.push({
          ...m,
          locationId: loc.id,
          location: { name: loc.name, country: loc.country, flag: loc.flag, accentColor: loc.accentColor },
          _displayTitle: pick(m.title, lang),
        });
      });
    });
    return items;
  }, [lang]);

  // First 12 for the grid (display:none hides overflow on small screens
  // via the CSS media queries).
  const povItems = allPov.slice(0, 12);

  // Kinetic backdrop text — signature rhythm of the section.
  const kinetic = {
    es: 'POV · Lente usada · Ray-Ban Meta · Captura en vivo · ',
    en: 'POV · Worn Lens · Ray-Ban Meta · Live Capture · ',
    it: 'POV · Lente indossata · Ray-Ban Meta · Cattura dal vivo · ',
  }[lang] || 'POV · Worn Lens · Ray-Ban Meta · Live Capture · ';

  // Micro-stats: derived from actual POV inventory + a flat footage
  // estimate. Updates automatically if new POV clips are added to
  // LOCATIONS_V2.
  const povStats = useMemo(() => {
    const places = new Set(allPov.map(m => m.locationId)).size;
    // Each POV clip is ~1 min on average; rounded to nearest 5.
    const minutes = Math.max(30, Math.round(allPov.length * 0.9 / 5) * 5);
    return { clips: allPov.length, places, minutes };
  }, [allPov]);

  const statCopy = {
    es: { clips: 'clips', places: 'lugares', minutes: 'min. grabados' },
    en: { clips: 'clips', places: 'places', minutes: 'min. captured' },
    it: { clips: 'clip', places: 'luoghi', minutes: 'min. registrati' },
  }[lang] || { clips: 'clips', places: 'places', minutes: 'min. captured' };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.includes('@')) return;
    setSubmitted(true);
    setEmail('');
  };

  return (
    <section className="rayban" id="pov" ref={sectionRef}>
      {/* Looping kinetic backdrop (decorative, aria-hidden). Track is
          duplicated so the marquee loops seamlessly at -50%. */}
      <div className="rayban-kinetic" aria-hidden="true">
        <div className="rayban-kinetic-track">
          <span>{kinetic}{kinetic}{kinetic}{kinetic}</span>
          <span>{kinetic}{kinetic}{kinetic}{kinetic}</span>
        </div>
      </div>

      <div className="rayban-head">
        <span className="section-overline">{t.pov.overline}</span>
        <h2 className="section-title">{t.pov.title}</h2>
        <p className="section-sub">{t.pov.sub}</p>
      </div>

      {/* Spectacle frame — twin lenses + metal bridge. */}
      <div className="rayban-spectacle" aria-hidden="true">
        <div className="rayban-lenses">
          <PovLens visible={glassesVisible} pool={povItems} startIdx={0} />
          <span className="rayban-bridge" />
          <PovLens visible={glassesVisible} pool={povItems} startIdx={1} />
        </div>
      </div>

      {/* Micro-stats: makes the archive feel like a body of work. */}
      <div className="rayban-stats">
        <div className="rayban-stat">
          <span className="rayban-stat-num">{povStats.clips}</span>
          <span className="rayban-stat-label">{statCopy.clips}</span>
        </div>
        <div className="rayban-stat">
          <span className="rayban-stat-num">{povStats.places}</span>
          <span className="rayban-stat-label">{statCopy.places}</span>
        </div>
        <div className="rayban-stat">
          <span className="rayban-stat-num">{povStats.minutes}+</span>
          <span className="rayban-stat-label">{statCopy.minutes}</span>
        </div>
      </div>

      {/* Vertical filmstrip of POV clips. */}
      <div className="rayban-grid">
        {povItems.map((it, i) => (
          <button key={it.id} className="rayban-item" onClick={() => lb.open(povItems, i)}>
            <img src={it.poster} alt={it._displayTitle} loading="lazy" decoding="async" />
            <video
              muted loop playsInline preload="none"
              poster={it.poster}
              onMouseEnter={(e) => {
                if (!e.currentTarget.src) e.currentTarget.src = it.src;
                e.currentTarget.play().catch(() => {});
              }}
              onMouseLeave={(e) => { e.currentTarget.pause(); }}
            />
            <div className="rayban-item-meta">
              <span>{it.location.flag}</span>
              <span>{it._displayTitle}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="rayban-cta">
        <h3>{t.pov.cta}</h3>
        <p>{t.pov.quote}</p>
        {submitted ? (
          <div className="rayban-thanks">{lang === 'es' ? 'Listo. Te avisamos.' : 'Done. We\'ll keep you posted.'}</div>
        ) : (
          <form onSubmit={handleSubmit} className="rayban-form">
            <input
              type="email"
              required
              placeholder={t.pov.cta_placeholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button type="submit">{t.pov.cta_button} <span>→</span></button>
          </form>
        )}
        <span className="rayban-coming">{t.pov.coming_soon}</span>
      </div>
    </section>
  );
}

// ─── PROCESS ──────────────────────────────────────────────────────────────
// ─── PROCESS / HOW I WORK (4 pasos editorial, hardcoded copy bilingüe) ────
function ProcessSection() {
  const { lang } = useChangeLang();
  const COPY = {
    es: {
      kicker: 'Proceso',
      title: 'Cuatro pasos. Sin sorpresas.',
      subtitle: 'Cada proyecto sigue la misma órbita: claridad al inicio, oficio en el medio, entrega en tiempo.',
      steps: [
        { n: '01', title: 'Briefing', time: '15-30 min · llamada o email',
          body: 'Empezamos por la historia. Qué querés contar, a quién, dónde. Si el proyecto pide drone, POV o foto, lo definimos acá. Te mando una cotización clara en 24 horas — sin letra chica.' },
        { n: '02', title: 'Scouting', time: '2-5 días antes del rodaje',
          body: 'Reviso locaciones, luz, clima y permisos. Si hace falta autorización ANAC o local, la gestiono yo. Llegás al día del rodaje sabiendo exactamente qué vamos a capturar y cuándo.' },
        { n: '03', title: 'Captura', time: '1-3 jornadas según proyecto',
          body: 'Vuelo con DJI Mini 4 Pro (4K, ProRes cuando hace falta), Ray-Ban Meta para POV inmersivo y cámara para foto fija. Todo respaldado en doble disco antes de bajar de la locación.' },
        { n: '04', title: 'Edición', time: '7 días · 2 rondas de revisión incluidas',
          body: 'Color grade cinematográfico, corte limpio, audio cuidado. Te entrego en 4K master + versiones para Instagram, web y broadcast. Los archivos quedan tuyos — derechos completos, sin marca de agua.' },
      ],
      footer: '¿Tenés un brief en mente? Empecemos por una llamada de 15 minutos.',
      cta: 'Reservar llamada',
    },
    en: {
      kicker: 'Process',
      title: 'Four steps. No surprises.',
      subtitle: 'Every project follows the same orbit: clarity up front, craft in the middle, delivery on time.',
      steps: [
        { n: '01', title: 'Briefing', time: '15-30 min · call or email',
          body: "We start with the story. What you want to tell, to whom, where. If the project calls for drone, POV or photo, we define it here. I send you a clear quote within 24 hours — no fine print." },
        { n: '02', title: 'Scouting', time: '2-5 days before the shoot',
          body: "I review locations, light, weather and permits. If we need ANAC or local authorization, I handle it. You arrive on shoot day knowing exactly what we'll capture and when." },
        { n: '03', title: 'Capture', time: '1-3 days depending on the project',
          body: 'Flying DJI Mini 4 Pro (4K, ProRes when needed), Ray-Ban Meta for immersive POV and a stills camera. Everything backed up to dual drives before leaving the location.' },
        { n: '04', title: 'Edit', time: '7 days · 2 rounds of revisions included',
          body: 'Cinematic color grade, clean cut, careful audio. I deliver in 4K master plus Instagram, web and broadcast cuts. The files are yours — full rights, no watermark.' },
      ],
      footer: "Got a brief in mind? Let's start with a 15-minute call.",
      cta: 'Book a call',
    },
  };
  const L = COPY[lang] || COPY.es;

  return (
    <section className="section how-i-work" id="process" aria-labelledby="how-title">
      <div className="container">
        <header className="how-head" data-reveal>
          <span className="kicker">{L.kicker}</span>
          <h2 className="section-title" id="how-title">{L.title}</h2>
          <p className="section-subtitle">{L.subtitle}</p>
        </header>
        <ol className="how-steps">
          {L.steps.map((s, i) => (
            <li className="how-step" key={i} data-reveal style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="how-step-num">{s.n}</div>
              <div className="how-step-body">
                <h3 className="how-step-title">{s.title}</h3>
                <p className="how-step-time">{s.time}</p>
                <p className="how-step-text">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="how-footer" data-reveal>
          <p className="how-footer-text">{L.footer}</p>
          <a href="#contact" className="btn-primary">
            {L.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 7h12m0 0L8 2m5 5L8 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── STATS BAND (entre Atlas y Archive) ──────────────────────────────────
function StatsBand() {
  const { lang } = useChangeLang();
  const labels = {
    es: { kicker: 'Tres años, una órbita', countries: 'países', flights: 'vuelos', hours: 'horas en el aire', brands: 'marcas', footer: 'Cifras al día de hoy. La órbita sigue.' },
    en: { kicker: 'Three years, one orbit', countries: 'countries', flights: 'flights', hours: 'hours airborne', brands: 'brands', footer: 'Numbers as of today. The orbit continues.' },
    it: { kicker: 'Tre anni, un\'orbita', countries: 'paesi', flights: 'voli', hours: 'ore in volo', brands: 'brand', footer: 'Numeri ad oggi. L\'orbita continua.' },
  };
  const L = labels[lang] || labels.es;
  const s = window.STATS_V2 || { countries: 0, flights: 0, hours_flown: 0, projects: 0 };
  const STATS = [
    { value: String(s.countries), label: L.countries },
    { value: String(s.flights) + '+', label: L.flights },
    { value: String(s.hours_flown) + '+', label: L.hours },
    { value: String(s.projects),   label: L.brands },
  ];
  return (
    <section className="stats-band" aria-labelledby="stats-kicker">
      <div className="container">
        <p className="stats-kicker" id="stats-kicker" data-reveal>{L.kicker}</p>
        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div className="stat-cell" key={i} data-reveal style={{ transitionDelay: `${i * 0.08}s` }}>
              <span className="stat-value">{s.value}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        <p className="stats-footer" data-reveal>{L.footer}</p>
      </div>
    </section>
  );
}

// ─── SOCIAL LINKS (con tracking GA4) ─────────────────────────────────────
const SOCIALS = [
  { label: 'Instagram', handle: '@emi_ranucoli',  href: 'https://www.instagram.com/emi_ranucoli/',     platform: 'instagram' },
  { label: 'LinkedIn',  handle: 'emilio-ranucoli', href: 'https://www.linkedin.com/in/emilio-ranucoli/', platform: 'linkedin' },
  { label: 'X',         handle: '@EmilioRanucoli', href: 'https://x.com/EmilioRanucoli',                platform: 'x' },
  { label: 'VSCO',      handle: 'emiliorturletto', href: 'https://vsco.co/emiliorturletto/gallery',    platform: 'vsco' },
];

function SocialLinks({ variant = 'list' }) {
  const handleClick = (platform) => {
    if (window.gtag) {
      window.gtag('event', 'social_click', { event_category: 'social', event_label: platform, outbound: true });
    }
  };
  if (variant === 'inline') {
    return (
      <div className="social-inline">
        {SOCIALS.map(s => (
          <a key={s.platform} href={s.href} target="_blank" rel="noopener noreferrer me"
             className="social-pill" aria-label={s.label} onClick={() => handleClick(s.platform)}>
            {s.label}
          </a>
        ))}
      </div>
    );
  }
  return (
    <ul className="social-list">
      {SOCIALS.map(s => (
        <li key={s.platform}>
          <a href={s.href} target="_blank" rel="noopener noreferrer me" onClick={() => handleClick(s.platform)}>
            <span className="social-label">{s.label}</span>
            <span className="social-handle">{s.handle}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

// ─── WHATSAPP FLOAT (mobile, aparece tras 25% de scroll) ─────────────────
const WHATSAPP_NUMBER = '393445721753'; // +39 344 572 1753 (sin '+')
const WHATSAPP_DEFAULT_MSG = {
  es: 'Hola Emilio, vi Ranuk Orbit y me gustaría contarte un proyecto.',
  en: "Hi Emilio, I saw Ranuk Orbit and I'd like to tell you about a project.",
};

function WhatsAppFloat() {
  const { lang } = useChangeLang();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = max > 0 ? window.scrollY / max : 0;
      setVisible(scrolled > 0.25);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const msg = encodeURIComponent(WHATSAPP_DEFAULT_MSG[lang] || WHATSAPP_DEFAULT_MSG.es);
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
       className={`whatsapp-float ${visible ? 'is-visible' : ''}`} aria-label="WhatsApp"
       onClick={() => { if (window.gtag) window.gtag('event', 'click_whatsapp', { event_category: 'engagement', event_label: 'float' }); }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
    </a>
  );
}

// ─── PRESS ────────────────────────────────────────────────────────────────
function PressSection() {
  const { t } = useChangeLang();
  const press = window.PRESS_V2 || [];
  return (
    <section className="press">
      <span className="press-label">{t.press.overline}</span>
      <div className="press-strip">
        {press.map((p, i) => (
          <div key={i} className="press-item">{p.name}</div>
        ))}
      </div>
    </section>
  );
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────
function TestimonialsSection() {
  const { t, lang } = useChangeLang();
  const items = window.TESTIMONIALS_V2 || [];
  const [active, setActive] = useState(0);
  return (
    <section className="testimonials">
      <div className="testimonials-head">
        <span className="section-overline">{t.testimonials.overline}</span>
        <h2 className="section-title">{t.testimonials.title}</h2>
      </div>
      <div className="testimonials-stage">
        {items.map((it, i) => (
          <blockquote key={i} className={`testimonial${i === active ? ' is-active' : ''}`}>
            <p>"{pick(it.quote, lang)}"</p>
            <footer>
              <strong>{it.name}</strong>
              <span>{pick(it.role, lang)}</span>
            </footer>
          </blockquote>
        ))}
      </div>
      <div className="testimonials-dots">
        {items.map((_, i) => (
          <button
            key={i}
            className={`tdot${i === active ? ' is-active' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Testimonial ${i+1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ─── CONTACT ──────────────────────────────────────────────────────────────
function ContactSection() {
  const { t } = useChangeLang();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.email.includes('@') || !form.message.trim()) return;
    setStatus('sending');
    try {
      const endpoint = window.RANUK_FORMSPREE || '';
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error('send failed');
      } else {
        const body = `Name: ${form.name}%0A%0A${form.message}`;
        window.location.href = `mailto:emilio@ranuk.dev?subject=Project%20brief&body=${body}`;
      }
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="contact" id="contact">
      <div className="contact-head">
        <span className="section-overline">{t.contact.overline}</span>
        <h2 className="section-title">{t.contact.title_1} <em>{t.contact.title_2}</em></h2>
        <p className="section-sub">{t.contact.sub}</p>
      </div>
      <form className="contact-form" onSubmit={onSubmit}>
        <div className="contact-row">
          <label>
            <span>{t.contact.form.name}</span>
            <input type="text" required value={form.name} onChange={update('name')} />
          </label>
          <label>
            <span>{t.contact.form.email}</span>
            <input type="email" required value={form.email} onChange={update('email')} />
          </label>
        </div>
        <label>
          <span>{t.contact.form.message}</span>
          <textarea rows={5} required value={form.message} onChange={update('message')} />
        </label>
        <button type="submit" className="contact-submit" disabled={status === 'sending'}>
          {status === 'sent' ? t.contact.form.sent : t.contact.form.send} <span>→</span>
        </button>
        {status === 'error' && <div className="contact-error">{t.contact.form.error}</div>}
      </form>
      <div className="contact-direct">
        <a href={`mailto:${t.contact.cta_primary}`}>{t.contact.cta_primary}</a>
        <span>·</span>
        <a href="https://instagram.com/" target="_blank" rel="noopener">Instagram</a>
        <span>·</span>
        <a href="https://youtube.com/" target="_blank" rel="noopener">YouTube</a>
      </div>
    </section>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────
function Footer() {
  const { t } = useChangeLang();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-mark">⊕</span>
          <span className="footer-wordmark">Ranuk Orbit</span>
          <span className="footer-tagline">{t.footer.tagline}</span>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h5>{t.nav.explore}</h5>
            <a href="#atlas">{t.nav.explore}</a>
            <a href="#archive">{t.nav.archive}</a>
            <a href="#pov">POV</a>
            <a href="#story">{t.nav.story}</a>
          </div>
          <div className="footer-col">
            <h5>{t.nav.services}</h5>
            <a href="#services">{t.nav.services}</a>
            <a href="#process">{t.nav.process}</a>
            <a href="#contact">{t.nav.contact}</a>
          </div>
          <div className="footer-col">
            <h5>—</h5>
            <a href="/privacy">{t.footer.privacy}</a>
            <a href="/terms">{t.footer.terms}</a>
          </div>
        </div>
      </div>
      <div className="footer-base">
        <span>© {new Date().getFullYear()} Emilio Ranucoli · {t.footer.copyright}</span>
        <span>Mar del Plata · Worldwide</span>
      </div>
    </footer>
  );
}

// ─── LOADING SCREEN ───────────────────────────────────────────────────────
function LoadingScreen({ done }) {
  return (
    <div className={`loading${done ? ' is-done' : ''}`}>
      <div className="loading-mark">⊕</div>
      <div className="loading-bar"><span /></div>
      <div className="loading-label">Ranuk Orbit</div>
    </div>
  );
}

// ─── MICROINTERACTIONS ────────────────────────────────────────────────────
function CustomCursor() {
  const cursorRef = useRef(null);
  const trailRef = useRef(null);
  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return;
    if (_prefersReducedMotion()) return;

    let x = 0, y = 0, tx = 0, ty = 0;
    let needsUpdate = false;
    const onMove = (e) => { x = e.clientX; y = e.clientY; needsUpdate = true; };
    document.addEventListener('mousemove', onMove, { passive: true });

    let raf;
    const tick = () => {
      if (needsUpdate) {
        tx += (x - tx) * 0.22;
        ty += (y - ty) * 0.22;
        if (cursorRef.current) cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
        if (trailRef.current) trailRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
        // Keep damping active for 6 frames after last move, then coast
        if (Math.abs(x - tx) < 0.5 && Math.abs(y - ty) < 0.5) needsUpdate = false;
      }
      raf = requestAnimationFrame(tick);
    };
    tick();

    const overInteractive = (e) => {
      const isLink = e.target.closest && e.target.closest('a, button, [role=button], input, textarea, select');
      if (cursorRef.current) cursorRef.current.classList.toggle('is-link', !!isLink);
      if (trailRef.current) trailRef.current.classList.toggle('is-link', !!isLink);
    };
    document.addEventListener('mouseover', overInteractive);

    // Pause tick when tab hidden
    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); }
      else { raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', overInteractive);
      document.removeEventListener('visibilitychange', onVis);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <>
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="cursor-trail" ref={trailRef} aria-hidden="true" />
    </>
  );
}

function useKonami() {
  useEffect(() => {
    const seq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let idx = 0;
    const onKey = (e) => {
      const k = e.key;
      if (k === seq[idx]) {
        idx++;
        if (idx === seq.length) {
          document.body.classList.add('konami');
          setTimeout(() => document.body.classList.remove('konami'), 6000);
          idx = 0;
        }
      } else { idx = 0; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-revealed');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────
function App() {
  const [loaded, setLoaded] = useState(false);
  const [reelOpen, setReelOpen] = useState(false);
  useEffect(() => {
    const tt = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(tt);
  }, []);
  // Global reel trigger: any anchor pointing to #reel (or calling
  // window.openReel()) opens the modal. Keeps the CTA in hero-jsx decoupled
  // from the reel implementation here.
  useEffect(() => {
    window.openReel = () => setReelOpen(true);
    const onClick = (e) => {
      const a = e.target.closest && e.target.closest('a[href="#reel"], [data-reel]');
      if (a) { e.preventDefault(); setReelOpen(true); }
    };
    document.addEventListener('click', onClick);
    return () => { document.removeEventListener('click', onClick); delete window.openReel; };
  }, []);
  useKonami();
  useScrollReveal();

  return (
    <LangProvider>
      <LightboxProvider>
        <LoadingScreen done={loaded} />
        <CustomCursor />
        <Nav />
        <main>
          <HeroSection />
          <AtlasSection />
          <StatsBand />
          <ArchiveSection />
          <StorySection />
          <RayBanSection />
          <ServicesSection />
          <ProcessSection />
          <TestimonialsSection />
          <PressSection />
          <ContactSection />
        </main>
        <Footer />
        <Lightbox />
        <ReelModal open={reelOpen} onClose={() => setReelOpen(false)} />
        <WhatsAppFloat />
      </LightboxProvider>
    </LangProvider>
  );
}

Object.assign(window, {
  Nav, ArchiveSection, StorySection, ServicesSection, RayBanSection,
  ProcessSection, PressSection, TestimonialsSection, ContactSection,
  StatsBand, SocialLinks, WhatsAppFloat,
  Footer, LoadingScreen, CustomCursor, App,
});
