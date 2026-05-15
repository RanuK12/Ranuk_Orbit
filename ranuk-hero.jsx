// Ranuk Orbit — Hero with multi-clip crossfade, Ken Burns, letter reveal, parallax, mute
const { useState, useEffect, useRef, useCallback, useMemo } = React;

// ─── Headline variants — toggle via window.RANUK_HEADLINE = 'A' | 'B' | 'C' (default C)
//
// Every variant MUST cover every supported locale (en/es/it). Missing a
// locale causes `HEADLINE_VARIANTS[variant][lang]` to return `undefined`
// — and then `data.lines` blows up with a TypeError that React cannot
// recover from (no Error Boundary above the hero), unmounting the
// whole tree. That was the root cause of the /it/ blank screen in
// the v8d21b41d bundle: variants A/B/C only had {en, es}.
const HEADLINE_VARIANTS = {
  A: {
    en: { lines: [['Ground was', 'never the'], ['limit']], emIndex: { line: 1, word: 0 } },
    es: { lines: [['El suelo nunca', 'fue el'], ['límite']], emIndex: { line: 1, word: 0 } },
    it: { lines: [['Il terreno', 'non fu mai'], ['il limite']], emIndex: { line: 1, word: 0 } },
  },
  B: {
    en: { lines: [['Stories the'], ['sky', 'tells']], emIndex: { line: 1, word: 0 } },
    es: { lines: [['Historias que'], ['el cielo', 'cuenta']], emIndex: { line: 1, word: 1 } },
    it: { lines: [['Storie che'], ['il cielo', 'racconta']], emIndex: { line: 1, word: 1 } },
  },
  C: {
    en: { lines: [['Earth, from'], ['another', 'angle']], emIndex: { line: 1, word: 0 } },
    es: { lines: [['La Tierra,', 'desde otro'], ['ángulo']], emIndex: { line: 1, word: 0 } },
    // Two-line layout: "La Terra," / "da un altro angolo". Putting "da
    // un altro angolo" on one line keeps the visual balance close to ES,
    // while splitting it across three lines made the hero look top-heavy
    // on desktop (tested at 1440px with the Italiana 132px setting).
    it: { lines: [['La Terra,'], ['da un altro', 'angolo']], emIndex: { line: 1, word: 1 } },
  },
};

// ─── Letter-reveal animation styles (toggleable):
// 'stagger' (default): each letter rises + fades sequentially
// 'curtain':           each letter slides up from below a fixed baseline
// 'blur':              each letter eases from blurred to focused
function HeroHeadline({ variant, anim, lang, parallax }) {
  // Defensive lookup: if a translator forgets a locale (or `variant` is
  // unknown), walk down to a guaranteed-non-null entry instead of
  // letting `data.lines` throw and unmount the whole app.
  //   1. requested variant + requested lang   (happy path)
  //   2. requested variant + en               (variant exists, locale missing)
  //   3. C + requested lang                   (variant unknown, locale OK)
  //   4. C + en                               (last-resort safety net)
  const v = HEADLINE_VARIANTS[variant] || HEADLINE_VARIANTS.C;
  const data = v[lang] || v.en || HEADLINE_VARIANTS.C[lang] || HEADLINE_VARIANTS.C.en;
  const lines = data.lines;
  const emIdx = data.emIndex;
  let charDelay = 0;
  const baseDelay = 0.45;
  const step = 0.015; // 15ms per letter — fast enough to read within 500ms total

  const renderWord = (word, lineI, wordI) => {
    const isEm = emIdx.line === lineI && emIdx.word === wordI;
    return (
      <span key={`${lineI}-${wordI}`} className={`hero-word${isEm ? ' is-em' : ''}`}>
        {[...word].map((ch, ci) => {
          const d = baseDelay + charDelay * step;
          charDelay += 1;
          return (
            <span key={ci} className={`hero-char hero-char--${anim}`} style={{ animationDelay: `${d}s` }}>
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          );
        })}
        <span className="hero-char-spacer">{'\u00A0'}</span>
      </span>
    );
  };

  return (
    <h1 className="hero-headline" style={{ transform: `translate(${parallax.x}px, ${parallax.y}px)` }}>
      {lines.map((words, lineI) => (
        <span key={lineI} className="hero-line">
          {words.map((w, wordI) => renderWord(w, lineI, wordI))}
        </span>
      ))}
    </h1>
  );
}

function MuteIcon({ muted }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>
  );
}

function HeroSection() {
  const { t, lang } = useLang();
  const sequence = window.HERO_SEQUENCE || [];
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(true);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const variant = window.RANUK_HEADLINE || 'C';
  const anim = window.RANUK_HERO_ANIM || 'stagger'; // 'stagger' | 'curtain' | 'blur'
  const containerRef = useRef(null);
  const videoRefs = useRef([]);

  // Mobile: show poster only — never autoplay heavy 4K
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(max-width: 768px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Sequence advance — 8s per clip, 1s blend
  useEffect(() => {
    if (isMobile || !sequence.length) return;
    const interval = setInterval(() => setActive(a => (a + 1) % sequence.length), 8000);
    return () => clearInterval(interval);
  }, [isMobile, sequence.length]);

  // Cursor parallax — max 8px shift
  useEffect(() => {
    const onMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const cy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setParallax({ x: cx * -8, y: cy * -8 });
    };
    const el = containerRef.current;
    if (el) el.addEventListener('mousemove', onMove);
    return () => { if (el) el.removeEventListener('mousemove', onMove); };
  }, []);

  const toggleMute = useCallback(() => {
    setMuted(m => {
      const next = !m;
      videoRefs.current.forEach(v => { if (v) v.muted = next; });
      return next;
    });
  }, []);

  return (
    <section className="hero" id="home" ref={containerRef}>
      <div className="hero-bg">
        {!isMobile && sequence.map((clip, i) => {
          // Lazy: solo cargar video activo + siguiente (para crossfade). El resto = poster JPG.
          const nextIdx = (active + 1) % sequence.length;
          const shouldLoad = i === active || i === nextIdx;
          return shouldLoad ? (
            <video
              key={i}
              ref={el => videoRefs.current[i] = el}
              className={`hero-video${i === active ? ' is-active' : ''}`}
              autoPlay muted={muted} loop playsInline
              poster={clip.poster}
              preload={i === active ? 'auto' : 'metadata'}
            >
              <source src={clip.src} type="video/mp4" />
            </video>
          ) : (
            <img
              key={i}
              className={`hero-video${i === active ? ' is-active' : ''}`}
              src={clip.poster}
              alt=""
              loading="lazy"
            />
          );
        })}
        {isMobile && sequence[0] && (
          <img className="hero-video is-active" src={sequence[0].poster} alt="" />
        )}
        <div className="hero-overlay" />
        <div className="hero-overlay-top" />
      </div>

      <div className="hero-content">
        <span className="hero-overline">{t.hero.overline}</span>
        <HeroHeadline variant={variant} anim={anim} lang={lang} parallax={parallax} />
        <p className="hero-sub" style={{ animationDelay: '1.4s' }}>{t.hero.sub}</p>
        <div className="hero-cta-row" style={{ animationDelay: '1.6s' }}>
          <a href="#explore" className="btn-ghost">{t.hero.cta} <span className="btn-arrow">→</span></a>
          {/* Reel CTA: button (not anchor). Earlier versions used
              <a href="#reel" data-reel>, which had two side effects:
              (1) clicking it pushed `#reel` into the URL, and
              (2) when the user later switched languages, navigateToLocale
                  preserved the hash, the new page loaded with #reel still
                  in the URL, the global `[data-reel]` click listener
                  fired on any in-flight click during the transition,
                  and the reel modal opened on its own. Using a real
                  <button> sidesteps both: no URL pollution, no anchor
                  navigation, just a deliberate user action. */}
          <button
            type="button"
            className="btn-link-light"
            data-reel
            onClick={() => { try { window.openReel && window.openReel(); } catch (_) {} }}
          >
            {t.hero.cta_secondary}
          </button>
        </div>
      </div>

      {/* Clip indicator dots */}
      {!isMobile && sequence.length > 1 && (
        <div className="hero-indicator">
          {sequence.map((c, i) => (
            <button
              key={i}
              className={`hero-dot${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
              aria-label={pick(c.label, lang)}
            />
          ))}
          <span className="hero-clip-label">{pick(sequence[active]?.label, lang)}</span>
        </div>
      )}

      {/* Mute toggle (top-right, mobile + desktop) */}
      <button className="hero-mute" onClick={toggleMute} aria-label={muted ? t.hero.unmuted : t.hero.muted}>
        <MuteIcon muted={muted} />
      </button>

      <a href="#explore" className="hero-scroll-hint">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-label">{t.hero.scroll}</span>
      </a>
    </section>
  );
}

Object.assign(window, { HeroSection });
