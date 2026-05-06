// Ranuk Orbit — i18n EN/ES (production copy)
const { createContext, useContext, useState, useEffect } = React;

const COPY = {
  en: {
    nav: { explore: 'Atlas', archive: 'Archive', story: 'Story', pov: 'POV', services: 'Services', process: 'Process', contact: 'Contact' },
    hero: {
      overline: 'Drone · POV · Travel',
      headline_lines: [['Earth,', 'from another'], ['angle']],
      headline_em_index: { line: 1, word: 0 }, // italic on "angle"
      sub: 'A film and stills practice rooted in real places — the Mediterranean, the Andes, the medina, the snow line.',
      cta: 'Open the Atlas',
      cta_secondary: 'Watch the reel',
      scroll: 'Scroll',
      muted: 'Sound off',
      unmuted: 'Sound on',
    },
    atlas: {
      overline: 'The Atlas',
      title: 'Twelve places, three years.',
      sub: 'Drag the globe. Click any pin to enter the place.',
      hint: 'Drag · Click pins to explore',
      sidebar_title: 'Locations',
      year_all: 'All years',
    },
    archive: {
      overline: 'The Archive',
      title: 'Browse the work.',
      sub: 'Filter by camera. Click any tile to open the lightbox.',
      filters: { all: 'All', drone: 'Drone', pov: 'Ray-Ban POV', photo: 'Stills' },
      counts: { photos: 'stills', videos: 'films' },
      empty: 'No items in this filter.',
    },
    story: {
      overline: 'The Story',
      title: 'A practice in three altitudes.',
      sub: 'How the work began, and where it points.',
      paragraphs: [
        'I grew up on the Atlantic coast of Argentina, where the horizon does most of the work. My first drone was a gift from my brother in 2021. I took it to the Sierras of Córdoba and didn\'t come back the same.',
        'The first commission came nine months later — a vineyard in Mendoza wanted to see itself from above. The footage paid for the next trip. The next trip paid for better gear. The pattern hasn\'t broken since.',
        'In 2024 I added the Ray-Ban Meta to the kit. Drone work is composed; POV is felt. Together they tell the same story from two directions — what a place looks like, and what it is to be there.',
        'Today I work between Mar del Plata, the Italian coast, and wherever the next brief sends me. Every project starts the same way: a 30-minute call and a question — what does this place want to say?',
      ],
      stats: [
        { value: 12, label: 'Countries' },
        { value: 280, label: 'Hours flown' },
        { value: 24, label: 'Projects delivered' },
      ],
      pull: '"The shot is never the story. The story emerges between shots."',
    },
    pov: {
      overline: 'Ray-Ban Meta · POV',
      title: 'At eye level.',
      sub: 'No composition, no framing. Only presence.',
      quote: 'POV is the opposite of drone work. The lens disappears, and what\'s left is the place itself, walking.',
      explainer_title: 'What is Ray-Ban Meta POV?',
      explainer_body: 'Smart-glasses-mounted cameras capture first-person footage at human pace. No tripod, no rig, no permission asked. The viewer sees what I see, hears what I hear, and walks where I walk.',
      cta: 'Subscribe to the POV series',
      cta_placeholder: 'your@email',
      cta_button: 'Get notified',
      coming_soon: 'Patagonia POV — Spring 2026',
    },
    services: {
      overline: 'Services',
      title: 'Three packages, one handshake.',
      sub: 'Pricing in EUR. Travel quoted separately.',
      cta: 'Email a brief',
      cta_call: 'Schedule a call',
      faq_overline: 'FAQ',
      faq_title: 'Things people ask.',
      trust: 'Trusted by',
      packages: [
        {
          tag: 'Aerial', title: 'Drone Capture', price: '€ 1,400',
          unit: '/ half-day',
          desc: 'For tourism boards, hospitality, real estate. Flight + color + masters.',
          features: ['DJI Mini 4 Pro / Air 3', 'Up to 4 hrs on location', '4K 60fps + verticals', 'Color-graded delivery in 7 days'],
        },
        {
          tag: 'POV · Most Popular', title: 'Travel Story', price: '€ 2,800',
          unit: '/ full project',
          desc: 'Drone + Ray-Ban POV + edit. The signature combination.',
          features: ['Up to 3 days on location', 'Drone + Ray-Ban Meta', '90s film + 30s vertical cut', 'Two revision rounds'],
          popular: true,
        },
        {
          tag: 'Editorial', title: 'Stills Series', price: '€ 850',
          unit: '/ series',
          desc: 'Photographic series for editorial and brand campaigns.',
          features: ['12–18 images', 'Drone + ground angles', 'Hi-res masters + crops', 'Web-ready WebP set'],
        },
        {
          tag: 'Bespoke', title: 'Custom', price: 'Let\'s talk',
          unit: '',
          desc: 'Multi-week documentaries, festivals, brand films. Bring the brief.',
          features: ['Co-developed brief', 'Producer + DP collaboration', 'Multiple deliverables', 'Travel + crew handled'],
        },
      ],
    },
    process: {
      overline: 'How we work',
      title: 'Brief → Plan → Capture → Deliver.',
      sub: 'Same four steps, every project. No surprises in the middle.',
    },
    press: { overline: 'Featured in', title: 'Selected mentions.' },
    testimonials: { overline: 'Words', title: 'What clients say.' },
    contact: {
      overline: 'Get in touch',
      title_1: 'Have a brief?',
      title_2: 'Let\'s film it.',
      sub: 'Reply within 24 hours, anywhere.',
      cta_primary: 'emilio@ranuk.dev',
      cta_secondary: 'Schedule a call',
      social_label: 'Elsewhere',
      form: { name: 'Your name', email: 'Email', message: 'What are we filming?', send: 'Send brief', sent: 'Got it. I\'ll reply within 24h.', error: 'Something failed. Try emailing direct.' },
    },
    footer: {
      tagline: 'Drone · POV · Travel',
      copyright: 'All rights reserved.',
      privacy: 'Privacy', terms: 'Terms',
    },
    moods: { oceanic: 'Oceanic', golden: 'Golden', cold: 'Cold', warm: 'Warm', green: 'Green' },
    altitudes: { aerial: 'Aerial', mountain: 'Mountain', street: 'Street', water: 'Water' },
  },
  es: {
    nav: { explore: 'Atlas', archive: 'Archivo', story: 'Historia', pov: 'POV', services: 'Servicios', process: 'Proceso', contact: 'Contacto' },
    hero: {
      overline: 'Drone · POV · Travel',
      headline_lines: [['La Tierra,', 'desde otro'], ['ángulo']],
      headline_em_index: { line: 1, word: 0 },
      sub: 'Una práctica de cine y foto enraizada en lugares reales — el Mediterráneo, los Andes, la medina, la línea de nieve.',
      cta: 'Abrir el Atlas',
      cta_secondary: 'Ver el reel',
      scroll: 'Bajá',
      muted: 'Sin sonido',
      unmuted: 'Con sonido',
    },
    atlas: {
      overline: 'El Atlas',
      title: 'Doce lugares, tres años.',
      sub: 'Arrastrá el globo. Hacé clic en un pin para entrar al lugar.',
      hint: 'Arrastrá · Clic en los pins para explorar',
      sidebar_title: 'Lugares',
      year_all: 'Todos los años',
    },
    archive: {
      overline: 'El Archivo',
      title: 'Navegá el trabajo.',
      sub: 'Filtrá por cámara. Clic en cualquier tile para abrir el lightbox.',
      filters: { all: 'Todo', drone: 'Drone', pov: 'Ray-Ban POV', photo: 'Foto' },
      counts: { photos: 'fotos', videos: 'films' },
      empty: 'No hay ítems en este filtro.',
    },
    story: {
      overline: 'La Historia',
      title: 'Una práctica en tres alturas.',
      sub: 'Cómo empezó el trabajo, y hacia dónde apunta.',
      paragraphs: [
        'Crecí en la costa atlántica argentina, donde el horizonte hace casi todo el trabajo. Mi primer drone fue un regalo de mi hermano en 2021. Lo llevé a las Sierras de Córdoba y no volví igual.',
        'El primer encargo vino nueve meses después — un viñedo en Mendoza quería verse desde arriba. Lo que cobré pagó el siguiente viaje. El siguiente viaje pagó mejor equipo. El patrón no se rompió desde entonces.',
        'En 2024 sumé las Ray-Ban Meta al kit. El drone es composición; el POV es presencia. Juntos cuentan la misma historia desde dos direcciones — cómo se ve un lugar, y qué se siente estar ahí.',
        'Hoy trabajo entre Mar del Plata, la costa italiana, y donde sea que mande el próximo brief. Cada proyecto empieza igual: una llamada de 30 minutos y una pregunta — ¿qué quiere decir este lugar?',
      ],
      stats: [
        { value: 12, label: 'Países' },
        { value: 280, label: 'Horas voladas' },
        { value: 24, label: 'Proyectos entregados' },
      ],
      pull: '"La toma nunca es la historia. La historia aparece entre las tomas."',
    },
    pov: {
      overline: 'Ray-Ban Meta · POV',
      title: 'A la altura de los ojos.',
      sub: 'Sin composición, sin encuadre. Solo presencia.',
      quote: 'El POV es lo opuesto al drone. La lente desaparece, y lo que queda es el lugar mismo, caminando.',
      explainer_title: '¿Qué es Ray-Ban Meta POV?',
      explainer_body: 'Cámaras montadas en gafas inteligentes capturan video en primera persona a ritmo humano. Sin trípode, sin rig, sin pedir permiso. El espectador ve lo que yo veo, oye lo que yo oigo, y camina por donde yo camino.',
      cta: 'Suscribite a la serie POV',
      cta_placeholder: 'tu@email',
      cta_button: 'Avisame',
      coming_soon: 'Patagonia POV — Primavera 2026',
    },
    services: {
      overline: 'Servicios',
      title: 'Tres paquetes, un apretón de manos.',
      sub: 'Precios en EUR. Viajes se cotizan aparte.',
      cta: 'Mandar brief por mail',
      cta_call: 'Agendar una llamada',
      faq_overline: 'Preguntas',
      faq_title: 'Lo que la gente suele preguntar.',
      trust: 'Confían en mí',
      packages: [
        {
          tag: 'Aéreo', title: 'Captura Drone', price: '€ 1.400',
          unit: '/ medio día',
          desc: 'Para entes de turismo, hospitalidad, real estate. Vuelo + color + masters.',
          features: ['DJI Mini 4 Pro / Air 3', 'Hasta 4 hs en locación', '4K 60fps + verticales', 'Entrega con color en 7 días'],
        },
        {
          tag: 'POV · Más elegido', title: 'Travel Story', price: '€ 2.800',
          unit: '/ proyecto completo',
          desc: 'Drone + Ray-Ban POV + edit. La combinación firma.',
          features: ['Hasta 3 días en locación', 'Drone + Ray-Ban Meta', 'Film 90s + corte vertical 30s', 'Dos rondas de revisión'],
          popular: true,
        },
        {
          tag: 'Editorial', title: 'Serie Foto', price: '€ 850',
          unit: '/ serie',
          desc: 'Series fotográficas para campañas editoriales y de marca.',
          features: ['12–18 imágenes', 'Drone + ángulos a tierra', 'Masters + recortes en alta', 'WebP listo para web'],
        },
        {
          tag: 'A medida', title: 'Custom', price: 'Hablemos',
          unit: '',
          desc: 'Documentales multi-semana, festivales, brand films. Traé el brief.',
          features: ['Brief co-desarrollado', 'Productor + DP colaborando', 'Múltiples entregables', 'Viajes + crew gestionados'],
        },
      ],
    },
    process: {
      overline: 'Cómo trabajamos',
      title: 'Brief → Plan → Captura → Entrega.',
      sub: 'Los mismos cuatro pasos, cada proyecto. Sin sorpresas en el medio.',
    },
    press: { overline: 'Apariciones', title: 'Menciones seleccionadas.' },
    testimonials: { overline: 'Palabras', title: 'Lo que dicen los clientes.' },
    contact: {
      overline: 'Contacto',
      title_1: '¿Tenés un brief?',
      title_2: 'Filmémoslo.',
      sub: 'Respondo en menos de 24 horas, donde sea.',
      cta_primary: 'emilio@ranuk.dev',
      cta_secondary: 'Agendar una llamada',
      social_label: 'En otros lados',
      form: { name: 'Tu nombre', email: 'Email', message: '¿Qué filmamos?', send: 'Enviar brief', sent: 'Recibido. Te respondo en 24h.', error: 'Algo falló. Mandame mail directo.' },
    },
    footer: {
      tagline: 'Drone · POV · Travel',
      copyright: 'Todos los derechos reservados.',
      privacy: 'Privacidad', terms: 'Términos',
    },
    moods: { oceanic: 'Oceánico', golden: 'Dorado', cold: 'Frío', warm: 'Cálido', green: 'Verde' },
    altitudes: { aerial: 'Aéreo', mountain: 'Montaña', street: 'Calle', water: 'Agua' },
  },
};

const LangContext = createContext(null);

function LangProvider({ children }) {
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem('ranuk_lang');
      if (saved === 'en' || saved === 'es') return saved;
      return (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';
    } catch (e) { return 'en'; }
  });
  useEffect(() => { try { localStorage.setItem('ranuk_lang', lang); } catch(e){} document.documentElement.lang = lang; }, [lang]);
  const change = (l) => setLang(l);
  return (
    <LangContext.Provider value={{ lang, change, t: COPY[lang] }}>
      {children}
    </LangContext.Provider>
  );
}
function useLang() { return useContext(LangContext); }

const pick = (v, lang) => (v && typeof v === 'object' && v[lang]) ? v[lang] : (typeof v === 'string' ? v : '');

Object.assign(window, { LangProvider, useLang, pick, COPY });
