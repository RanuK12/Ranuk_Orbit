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
      title: '{n} places, three years.',
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
      title: 'Showing what I\'m lucky enough to see.',
      sub: 'Why I started capturing images, and what I look for in every one.',
      paragraphs: [
        'I\'m a lucky one. I\'ve had the chance to travel, and from the first trip I felt something close to a debt — that what I was seeing didn\'t belong to me alone. I capture images so the person who can\'t be there gets to live it a little too.',
        'Before the camera, there\'s the eye. No gear replaces that. Before each photo or video I stop: I read the context, what the landscape is offering, what the moment has that\'s unrepeatable. If that reading doesn\'t come, better not to shoot — the image won\'t transmit anything.',
        'The drone was a shift in perspective. As a kid I dreamt of flying, and somehow that dream came true through the controller. But more than altitude, what it gave me was another way to read the same place — the line of the coast, the pattern of the forest, what the land says when you pull away from it.',
        'Today I combine air and ground: the drone for the composition only seen from above, the Ray-Ban Meta for the presence only felt walking. Every project starts with the same question — what does this place want to say, and how do I tell it without a postcard?',
      ],
      stat_labels: { countries: 'Countries', hours: 'Hours flown', projects: 'Projects delivered' },
      pull: '"A good image starts in the eyes, not in the camera."',
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
          tag: 'Starter', title: 'Drone Mini', price: '€ 390',
          unit: '/ 2 hrs',
          desc: 'Quick aerial set for restaurants, small hotels, single-property real estate.',
          features: ['Up to 2 hrs on location', '6–10 finished aerial images', '1 short reel (30s)', 'Web-ready delivery in 5 days'],
        },
        {
          tag: 'Aerial', title: 'Drone Capture', price: '€ 890',
          unit: '/ half-day',
          desc: 'For tourism boards, hospitality, real estate. Flight + color + masters.',
          features: ['DJI Mini 4 Pro / Air 3', 'Up to 4 hrs on location', '4K 60fps + verticals', 'Color-graded delivery in 7 days'],
        },
        {
          tag: 'POV · Most Popular', title: 'Travel Story', price: '€ 1,790',
          unit: '/ full project',
          desc: 'Drone + Ray-Ban POV + edit. The signature combination.',
          features: ['Up to 3 days on location', 'Drone + Ray-Ban Meta', '90s film + 30s vertical cut', 'Two revision rounds'],
          popular: true,
        },
        {
          tag: 'Editorial', title: 'Stills Series', price: '€ 590',
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
      title: '{n} lugares, tres años.',
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
      title: 'Mostrar lo que tengo la suerte de ver.',
      sub: 'Por qué empecé a captar imágenes, y qué busco con cada una.',
      paragraphs: [
        'Soy un afortunado. Tuve la posibilidad de viajar, y desde el primer viaje sentí algo parecido a una deuda — que lo que estoy viendo no me pertenece sólo a mí. Capto imágenes para que la persona que no puede estar acá lo viva un poco también.',
        'Antes de la cámara está la mirada. Ningún equipo reemplaza eso. Antes de cada foto o video me freno: leo el contexto, qué me ofrece el paisaje, qué tiene de único el momento. Si esa lectura no aparece, mejor no disparar — la imagen no va a transmitir nada.',
        'El drone fue un cambio de perspectiva. De chico soñaba con volar, y de algún modo ese sueño se cumplió desde el control. Pero más que la altura, lo que me dio fue otra forma de leer el mismo lugar — la línea de la costa, el patrón del bosque, lo que la tierra dice cuando uno se aleja.',
        'Hoy combino aire y tierra: el drone para la composición que sólo se ve desde arriba, las Ray-Ban Meta para la presencia que sólo se siente caminando. Cada proyecto empieza con la misma pregunta — ¿qué quiere decir este lugar, y cómo lo cuento sin postal?',
      ],
      stat_labels: { countries: 'Países', hours: 'Horas voladas', projects: 'Proyectos entregados' },
      pull: '"La buena imagen empieza en los ojos, no en la cámara."',
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
          tag: 'Starter', title: 'Drone Mini', price: '€ 390',
          unit: '/ 2 hs',
          desc: 'Set aéreo rápido para restaurantes, hoteles boutique, una propiedad puntual.',
          features: ['Hasta 2 hs en locación', '6–10 imágenes aéreas finalizadas', '1 reel corto (30s)', 'Entrega lista para web en 5 días'],
        },
        {
          tag: 'Aéreo', title: 'Captura Drone', price: '€ 890',
          unit: '/ medio día',
          desc: 'Para entes de turismo, hospitalidad, real estate. Vuelo + color + masters.',
          features: ['DJI Mini 4 Pro / Air 3', 'Hasta 4 hs en locación', '4K 60fps + verticales', 'Entrega con color en 7 días'],
        },
        {
          tag: 'POV · Más elegido', title: 'Travel Story', price: '€ 1.790',
          unit: '/ proyecto completo',
          desc: 'Drone + Ray-Ban POV + edit. La combinación firma.',
          features: ['Hasta 3 días en locación', 'Drone + Ray-Ban Meta', 'Film 90s + corte vertical 30s', 'Dos rondas de revisión'],
          popular: true,
        },
        {
          tag: 'Editorial', title: 'Serie Foto', price: '€ 590',
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
  it: {
    nav: { explore: 'Atlante', archive: 'Archivio', story: 'Storia', pov: 'POV', services: 'Servizi', process: 'Processo', contact: 'Contatti' },
    hero: {
      overline: 'Drone · POV · Travel',
      headline_lines: [['La Terra,', 'da un altro'], ['angolo']],
      headline_em_index: { line: 1, word: 0 },
      sub: 'Un lavoro di cinema e fotografia radicato in luoghi reali — il Mediterraneo, le Ande, la medina, la linea della neve.',
      cta: 'Apri l\'Atlante',
      cta_secondary: 'Guarda il reel',
      scroll: 'Scorri',
      muted: 'Senza audio',
      unmuted: 'Con audio',
    },
    atlas: {
      overline: 'L\'Atlante',
      title: '{n} luoghi, tre anni.',
      sub: 'Trascina il globo. Clicca un pin per entrare nel luogo.',
      hint: 'Trascina · Clicca i pin per esplorare',
      sidebar_title: 'Luoghi',
      year_all: 'Tutti gli anni',
    },
    archive: {
      overline: 'L\'Archivio',
      title: 'Sfoglia il lavoro.',
      sub: 'Filtra per camera. Clicca qualsiasi tile per aprire il lightbox.',
      filters: { all: 'Tutto', drone: 'Drone', pov: 'Ray-Ban POV', photo: 'Foto' },
      counts: { photos: 'foto', videos: 'film' },
      empty: 'Nessun elemento in questo filtro.',
    },
    story: {
      overline: 'La Storia',
      title: 'Mostrare ciò che ho la fortuna di vedere.',
      sub: 'Perché ho iniziato a catturare immagini, e cosa cerco in ognuna.',
      paragraphs: [
        'Sono un fortunato. Ho avuto la possibilità di viaggiare, e dal primo viaggio ho sentito qualcosa di simile a un debito — che ciò che stavo vedendo non apparteneva solo a me. Catturo immagini perché la persona che non può essere lì lo viva un po\' anche lei.',
        'Prima della macchina c\'è lo sguardo. Nessuna attrezzatura lo sostituisce. Prima di ogni foto o video mi fermo: leggo il contesto, cosa mi offre il paesaggio, cosa ha di unico il momento. Se quella lettura non arriva, meglio non scattare — l\'immagine non trasmetterà nulla.',
        'Il drone è stato un cambio di prospettiva. Da bambino sognavo di volare, e in qualche modo quel sogno si è avverato attraverso il radiocomando. Ma più dell\'altitudine, mi ha dato un altro modo di leggere lo stesso luogo — la linea della costa, il pattern del bosco, ciò che la terra dice quando ti allontani.',
        'Oggi unisco aria e terra: il drone per la composizione che si vede solo dall\'alto, i Ray-Ban Meta per la presenza che si sente solo camminando. Ogni progetto inizia con la stessa domanda — cosa vuole dire questo luogo, e come lo racconto senza cartolina?',
      ],
      stat_labels: { countries: 'Paesi', hours: 'Ore di volo', projects: 'Progetti consegnati' },
      pull: '"Una buona immagine nasce negli occhi, non nella macchina."',
    },
    pov: {
      overline: 'Ray-Ban Meta · POV',
      title: 'Ad altezza occhi.',
      sub: 'Senza composizione, senza inquadratura. Solo presenza.',
      quote: 'Il POV è l\'opposto del lavoro col drone. La lente scompare, e quel che resta è il luogo stesso, che cammina.',
      explainer_title: 'Cos\'è Ray-Ban Meta POV?',
      explainer_body: 'Telecamere montate su occhiali smart catturano video in prima persona a ritmo umano. Senza treppiede, senza rig, senza chiedere permesso. Lo spettatore vede ciò che vedo io, sente ciò che sento io, e cammina dove cammino io.',
      cta: 'Iscriviti alla serie POV',
      cta_placeholder: 'tua@email',
      cta_button: 'Avvisami',
      coming_soon: 'Patagonia POV — Primavera 2026',
    },
    services: {
      overline: 'Servizi',
      title: 'Tre pacchetti, una stretta di mano.',
      sub: 'Prezzi in EUR. Viaggi quotati a parte.',
      cta: 'Manda un brief via mail',
      cta_call: 'Prenota una chiamata',
      faq_overline: 'FAQ',
      faq_title: 'Le cose che chiedono.',
      trust: 'Si fidano di me',
      packages: [
        {
          tag: 'Starter', title: 'Drone Mini', price: '€ 390',
          unit: '/ 2 ore',
          desc: 'Set aereo rapido per ristoranti, hotel boutique, una singola proprietà.',
          features: ['Fino a 2 ore in location', '6–10 immagini aeree finite', '1 reel breve (30s)', 'Consegna pronta per il web in 5 giorni'],
        },
        {
          tag: 'Aereo', title: 'Cattura Drone', price: '€ 890',
          unit: '/ mezza giornata',
          desc: 'Per enti turistici, hospitality, real estate. Volo + color + master.',
          features: ['DJI Mini 4 Pro / Air 3', 'Fino a 4 ore in location', '4K 60fps + verticali', 'Consegna con color in 7 giorni'],
        },
        {
          tag: 'POV · Più scelto', title: 'Travel Story', price: '€ 1.790',
          unit: '/ progetto completo',
          desc: 'Drone + Ray-Ban POV + edit. La combinazione firma.',
          features: ['Fino a 3 giorni in location', 'Drone + Ray-Ban Meta', 'Film 90s + taglio verticale 30s', 'Due round di revisione'],
          popular: true,
        },
        {
          tag: 'Editorial', title: 'Serie Foto', price: '€ 590',
          unit: '/ serie',
          desc: 'Serie fotografiche per campagne editoriali e brand.',
          features: ['12–18 immagini', 'Drone + angoli a terra', 'Master + crop in alta', 'WebP pronto per il web'],
        },
        {
          tag: 'Su misura', title: 'Custom', price: 'Parliamone',
          unit: '',
          desc: 'Documentari multi-settimana, festival, brand film. Porta il brief.',
          features: ['Brief co-sviluppato', 'Producer + DP in collaborazione', 'Più deliverable', 'Viaggi + crew gestiti'],
        },
      ],
    },
    process: {
      overline: 'Come lavoriamo',
      title: 'Brief → Piano → Cattura → Consegna.',
      sub: 'Gli stessi quattro passi, ogni progetto. Nessuna sorpresa nel mezzo.',
    },
    press: { overline: 'Apparizioni', title: 'Menzioni selezionate.' },
    testimonials: { overline: 'Parole', title: 'Cosa dicono i clienti.' },
    contact: {
      overline: 'Contatti',
      title_1: 'Hai un brief?',
      title_2: 'Filmiamolo.',
      sub: 'Rispondo entro 24 ore, ovunque.',
      cta_primary: 'emilio@ranuk.dev',
      cta_secondary: 'Prenota una chiamata',
      social_label: 'Altrove',
      form: { name: 'Il tuo nome', email: 'Email', message: 'Cosa filmiamo?', send: 'Invia brief', sent: 'Ricevuto. Ti rispondo entro 24h.', error: 'Qualcosa è fallito. Mandami una mail diretta.' },
    },
    footer: {
      tagline: 'Drone · POV · Travel',
      copyright: 'Tutti i diritti riservati.',
      privacy: 'Privacy', terms: 'Termini',
    },
    moods: { oceanic: 'Oceanico', golden: 'Dorato', cold: 'Freddo', warm: 'Caldo', green: 'Verde' },
    altitudes: { aerial: 'Aereo', mountain: 'Montagna', street: 'Strada', water: 'Acqua' },
  },
};

const LangContext = createContext(null);

// Resolve initial lang in priority: window.RANUK_LANG (injected by /es/ /en/ /it/ pages)
//   → URL path prefix (/es/, /en/, /it/) → localStorage → navigator.language → 'en'
function resolveInitialLang() {
  try {
    if (typeof window !== 'undefined' && window.RANUK_LANG) {
      const w = String(window.RANUK_LANG).toLowerCase();
      if (w === 'en' || w === 'es' || w === 'it') return w;
    }
    const path = (location.pathname || '').toLowerCase();
    const m = path.match(/^\/(es|en|it)(\/|$)/);
    if (m) return m[1];
    const saved = localStorage.getItem('ranuk_lang');
    if (saved === 'en' || saved === 'es' || saved === 'it') return saved;
    const nav = (navigator.language || 'en').toLowerCase();
    if (nav.startsWith('es')) return 'es';
    if (nav.startsWith('it')) return 'it';
    return 'en';
  } catch (e) { return 'en'; }
}

// Navigate to the locale-prefixed URL preserving fragment + query.
// On the root site we go to /<lang>/, on a subpath we replace the prefix.
function navigateToLocale(lang) {
  try {
    const path = location.pathname || '/';
    const hash = location.hash || '';
    const search = location.search || '';
    const m = path.match(/^\/(es|en|it)(\/.*)?$/);
    const rest = m ? (m[2] || '/') : path;
    const target = `/${lang}${rest === '/' ? '/' : rest}${search}${hash}`;
    if (target !== path + search + hash) location.assign(target);
  } catch (e) { /* noop */ }
}

function LangProvider({ children }) {
  const [lang, setLang] = useState(resolveInitialLang);
  useEffect(() => { try { localStorage.setItem('ranuk_lang', lang); } catch(e){} document.documentElement.lang = lang; }, [lang]);
  const change = (l) => {
    if (l !== 'en' && l !== 'es' && l !== 'it') return;
    try { localStorage.setItem('ranuk_lang', l); } catch(e){}
    // Switch URL so deep links keep the locale; falls back to in-place state if navigation fails.
    setLang(l);
    navigateToLocale(l);
  };
  return (
    <LangContext.Provider value={{ lang, change, t: COPY[lang] || COPY.en }}>
      {children}
    </LangContext.Provider>
  );
}
function useLang() { return useContext(LangContext); }

const pick = (v, lang) => (v && typeof v === 'object' && v[lang]) ? v[lang] : (typeof v === 'string' ? v : '');

Object.assign(window, { LangProvider, useLang, pick, COPY });
