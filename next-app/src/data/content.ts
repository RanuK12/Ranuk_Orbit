import type { FaqItem, ProcessStep, Testimonial, PressItem, ServicePackage } from '@/types';

export const SERVICES: ServicePackage[] = [
  {
    id: 'starter',
    tag: { en: 'Starter', es: 'Starter', it: 'Starter' },
    title: { en: 'Drone Mini', es: 'Drone Mini', it: 'Drone Mini' },
    price: '€ 390',
    unit: { en: '/ 2 hrs', es: '/ 2 hs', it: '/ 2 ore' },
    desc: {
      en: 'Quick aerial set for restaurants, small hotels, single-property real estate.',
      es: 'Set aéreo rápido para restaurantes, hoteles boutique, una propiedad puntual.',
      it: 'Set aereo rapido per ristoranti, hotel boutique, una singola proprietà.',
    },
    features: [
      { en: 'Up to 2 hrs on location', es: 'Hasta 2 hs en locación', it: 'Fino a 2 ore in location' },
      { en: '6–10 finished aerial images', es: '6–10 imágenes aéreas finalizadas', it: '6–10 immagini aeree finite' },
      { en: '1 short reel (30s)', es: '1 reel corto (30s)', it: '1 reel breve (30s)' },
      { en: 'Web-ready delivery in 5 days', es: 'Entrega lista para web en 5 días', it: 'Consegna per web in 5 giorni' },
    ],
  },
  {
    id: 'aerial',
    tag: { en: 'Aerial', es: 'Aéreo', it: 'Aereo' },
    title: { en: 'Drone Capture', es: 'Captura Drone', it: 'Cattura Drone' },
    price: '€ 890',
    unit: { en: '/ half-day', es: '/ medio día', it: '/ mezza giornata' },
    desc: {
      en: 'For tourism boards, hospitality, real estate. Flight + color + masters.',
      es: 'Para entes de turismo, hospitalidad, real estate. Vuelo + color + masters.',
      it: 'Per enti turistici, hospitality, real estate. Volo + color + master.',
    },
    features: [
      { en: 'DJI Mini 4 Pro / Air 3', es: 'DJI Mini 4 Pro / Air 3', it: 'DJI Mini 4 Pro / Air 3' },
      { en: 'Up to 4 hrs on location', es: 'Hasta 4 hs en locación', it: 'Fino a 4 ore in location' },
      { en: '4K 60fps + verticals', es: '4K 60fps + verticales', it: '4K 60fps + verticali' },
      { en: 'Color-graded delivery in 7 days', es: 'Entrega con color en 7 días', it: 'Consegna con color in 7 giorni' },
    ],
  },
  {
    id: 'travel',
    tag: { en: 'Most Popular', es: 'Más elegido', it: 'Più scelto' },
    title: { en: 'Travel Story', es: 'Travel Story', it: 'Travel Story' },
    price: '€ 1,790',
    unit: { en: '/ full project', es: '/ proyecto completo', it: '/ progetto completo' },
    desc: {
      en: 'Drone + Ray-Ban POV + edit. The signature combination.',
      es: 'Drone + Ray-Ban POV + edit. La combinación firma.',
      it: 'Drone + Ray-Ban POV + edit. La combinazione firma.',
    },
    features: [
      { en: 'Up to 3 days on location', es: 'Hasta 3 días en locación', it: 'Fino a 3 giorni in location' },
      { en: 'Drone + Ray-Ban Meta', es: 'Drone + Ray-Ban Meta', it: 'Drone + Ray-Ban Meta' },
      { en: '90s film + 30s vertical cut', es: 'Film 90s + corte vertical 30s', it: 'Film 90s + taglio verticale 30s' },
      { en: 'Two revision rounds', es: 'Dos rondas de revisión', it: 'Due round di revisione' },
    ],
    popular: true,
  },
  {
    id: 'editorial',
    tag: { en: 'Editorial', es: 'Editorial', it: 'Editorial' },
    title: { en: 'Stills Series', es: 'Serie Foto', it: 'Serie Foto' },
    price: '€ 590',
    unit: { en: '/ series', es: '/ serie', it: '/ serie' },
    desc: {
      en: 'Photographic series for editorial and brand campaigns.',
      es: 'Series fotográficas para campañas editoriales y de marca.',
      it: 'Serie fotografiche per campagne editoriali e brand.',
    },
    features: [
      { en: '12–18 images', es: '12–18 imágenes', it: '12–18 immagini' },
      { en: 'Drone + ground angles', es: 'Drone + ángulos a tierra', it: 'Drone + angoli a terra' },
      { en: 'Hi-res masters + crops', es: 'Masters + recortes en alta', it: 'Master + crop in alta' },
      { en: 'Web-ready WebP set', es: 'WebP listo para web', it: 'WebP pronto per il web' },
    ],
  },
];

export const FAQ: FaqItem[] = [
  {
    q: { en: 'What is your typical turnaround?', es: '¿Cuál es el tiempo de entrega típico?', it: 'Qual è il tempo di consegna tipico?' },
    a: { en: 'Drafts within 5 working days, finals in 10–14 depending on scope.', es: 'Avances en 5 días hábiles, finales entre 10 y 14 según el alcance.', it: 'Bozze in 5 giorni lavorativi, finali in 10–14 a seconda dello scope.' },
  },
  {
    q: { en: 'What do I receive at delivery?', es: '¿Qué recibo en la entrega?', it: 'Cosa ricevo alla consegna?' },
    a: { en: 'Color-graded master, 1080p web cuts, vertical 9:16, and originals on request.', es: 'Master con color, cortes 1080p para web, verticales 9:16 y originales bajo pedido.', it: 'Master con color, tagli web 1080p, verticali 9:16 e originali su richiesta.' },
  },
  {
    q: { en: 'Do you travel for shoots?', es: '¿Viajás para los rodajes?', it: 'Viaggi per i shooting?' },
    a: { en: 'Yes — based in Mar del Plata, available worldwide. Travel quoted separately.', es: 'Sí — base en Mar del Plata, disponible mundialmente. Viajes se cotizan aparte.', it: 'Sì — base a Mar del Plata, disponibile ovunque. Viaggi quotati a parte.' },
  },
  {
    q: { en: 'How does licensing work?', es: '¿Cómo funciona la licencia?', it: 'Come funziona la licenza?' },
    a: { en: 'Standard usage included. Broadcast, paid media, and exclusivity quoted on top.', es: 'Uso estándar incluido. Broadcast, medios pagos y exclusividad se cotizan aparte.', it: 'Uso standard incluso. Broadcast, media a pagamento ed esclusività quotati a parte.' },
  },
  {
    q: { en: 'Are you certified to fly drones?', es: '¿Estás certificado para volar drones?', it: 'Sei certificato per pilotare droni?' },
    a: { en: 'Yes. ANAC-certified in Argentina. EU A1/A3 compliant. Insured equipment.', es: 'Sí. Certificación ANAC Argentina. Cumple EU A1/A3. Equipo asegurado.', it: 'Sì. Certificazione ANAC Argentina. Conforme EU A1/A3. Attrezzatura assicurata.' },
  },
  {
    q: { en: 'What gear do you fly?', es: '¿Con qué equipo volás?', it: 'Con che attrezzatura voli?' },
    a: { en: 'DJI Mini 4 Pro for travel, Air 3 for higher payloads. Ray-Ban Meta for POV.', es: 'DJI Mini 4 Pro para viaje, Air 3 para carga útil. Ray-Ban Meta para POV.', it: 'DJI Mini 4 Pro per viaggio, Air 3 per payload maggiori. Ray-Ban Meta per POV.' },
  },
  {
    q: { en: 'Can you work to a creative brief?', es: '¿Trabajás con un brief creativo?', it: 'Lavori su brief creativo?' },
    a: { en: 'Yes — bring storyboards, shot lists, mood references. I deliver to brief or co-create from scratch.', es: 'Sí — trae storyboards, shot lists, referencias. Entrego según brief o co-creo desde cero.', it: 'Sì — portami storyboard, shot list, riferimenti. Consegno su brief o co-creo da zero.' },
  },
  {
    q: { en: 'Deposit and payment terms?', es: '¿Anticipo y términos de pago?', it: 'Acconto e termini di pagamento?' },
    a: { en: '50% to lock dates, 50% on delivery. USD or EUR via wire or Wise.', es: '50% para fijar fechas, 50% al entregar. USD o EUR por transferencia o Wise.', it: '50% per bloccare le date, 50% alla consegna. USD o EUR via bonifico o Wise.' },
  },
];

export const PROCESS: ProcessStep[] = [
  {
    n: '01',
    title: { en: 'Brief', es: 'Brief', it: 'Brief' },
    body: {
      en: 'A 30-min call. Goals, locations, audiences. We define the success picture together.',
      es: 'Una llamada de 30 min. Objetivos, ubicaciones, audiencias. Definimos juntos cómo se ve el éxito.',
      it: 'Una chiamata di 30 min. Obiettivi, location, audience. Definiamo insieme il quadro del successo.',
    },
  },
  {
    n: '02',
    title: { en: 'Plan', es: 'Plan', it: 'Piano' },
    body: {
      en: 'Shot list, weather windows, permits, gear. Every flight scouted before takeoff.',
      es: 'Shot list, ventanas de clima, permisos, equipo. Cada vuelo se scoutea antes del despegue.',
      it: 'Shot list, finestre meteo, permessi, attrezzatura. Ogni volo preparato prima del decollo.',
    },
  },
  {
    n: '03',
    title: { en: 'Capture', es: 'Captura', it: 'Cattura' },
    body: {
      en: 'On location with redundant batteries, ND filters, Ray-Ban Meta for the in-between moments.',
      es: 'En ubicación con baterías redundantes, filtros ND, Ray-Ban Meta para los momentos intermedios.',
      it: 'In location con batterie di scorta, filtri ND, Ray-Ban Meta per i momenti intermedi.',
    },
  },
  {
    n: '04',
    title: { en: 'Deliver', es: 'Entrega', it: 'Consegna' },
    body: {
      en: 'Color-graded edit, vertical cuts, masters and source files. Two revision rounds included.',
      es: 'Edit con color, cortes verticales, masters y fuentes. Dos rondas de revisión incluidas.',
      it: 'Edit con color, tagli verticali, master e sorgenti. Due round di revisione inclusi.',
    },
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    quote: {
      en: "I'll probably never make it to Sardinia, but watching your video felt like I was floating over it. Thank you for taking me there.",
      es: 'Seguro nunca voy a poder ir a Cerdeña, pero mirar tu video fue como flotar arriba de la isla. Gracias por llevarme.',
      it: "Probabilmente non riuscirò mai ad andare in Sardegna, ma guardare il tuo video è stato come fluttuare sopra l'isola. Grazie per portarmici.",
    },
    name: 'Lucía F.',
    role: { en: 'Friend · Buenos Aires', es: 'Amiga · Buenos Aires', it: 'Amica · Buenos Aires' },
  },
  {
    quote: {
      en: "Every time you post, I save it. It's the closest thing I have to traveling. Don't stop showing what you see.",
      es: 'Cada vez que subís algo lo guardo. Es lo más cerca que estoy de viajar. No dejes nunca de mostrar lo que ves.',
      it: 'Ogni volta che pubblichi qualcosa la salvo. È la cosa più vicina al viaggiare che ho. Non smettere mai di mostrare ciò che vedi.',
    },
    name: 'Diego M.',
    role: { en: 'Cousin · Córdoba', es: 'Primo · Córdoba', it: 'Cugino · Córdoba' },
  },
  {
    quote: {
      en: "Your photos aren't postcards — they're a way of looking. You feel the place before you see it.",
      es: 'Tus fotos no son postales — son una forma de mirar. Se siente el lugar antes de verlo.',
      it: 'Le tue foto non sono cartoline — sono un modo di guardare. Si sente il luogo prima di vederlo.',
    },
    name: 'Florencia S.',
    role: { en: 'Friend · Mar del Plata', es: 'Amiga · Mar del Plata', it: 'Amica · Mar del Plata' },
  },
];

export const PRESS: PressItem[] = [
  { name: 'DJI Pilot Showcase', year: 2024 },
  { name: 'Italian Tourism Board', year: 2024 },
  { name: 'Patagonia Travel Co.', year: 2023 },
  { name: 'Marrakech Films', year: 2023 },
  { name: 'Ray-Ban Meta Creators', year: 2025 },
];

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/emi_ranucoli/',
  linkedin: 'https://www.linkedin.com/in/emilio-ranucoli/',
  twitter: 'https://x.com/EmilioRanucoli',
  vsco: 'https://vsco.co/emiliorturletto/gallery',
  email: 'emilio@ranuk.dev',
  whatsapp: 'https://wa.me/5492235551234', // Placeholder — update with real number
} as const;

export const SITE = {
  name: 'Ranuk Orbit',
  author: 'Emilio Ranucoli',
  tagline: 'Drone · POV · Travel',
  url: 'https://ranukorbit.com',
  location: 'Mar del Plata, AR',
} as const;
