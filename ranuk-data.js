// Ranuk Orbit v2 — Real coords, real titles, EXIF where known
// 13 fotos drone · 10 fotos rayban · 43 videos drone · 39 videos rayban

// Slug helper: convierte nombres con ñ/espacios/símbolos a paths web-safe
// Permite que ranuk-data.js mantenga los nombres originales pero apunte a /optimized/
const _slug = (n) => {
  // separar nombre y extensión
  const dot = n.lastIndexOf('.');
  const name = dot >= 0 ? n.slice(0, dot) : n;
  return name
    .toLowerCase()
    .replace(/ñ/g, 'n')
    .replace(/[áàä]/g, 'a').replace(/[éèë]/g, 'e').replace(/[íìï]/g, 'i').replace(/[óòö]/g, 'o').replace(/[úùü]/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};
// Absolute paths (leading slash) so the manifest resolves identically
// whether the page is served from "/", "/en/", "/es/" or "/it/". Using
// relative paths broke the gallery when switching to a locale subfolder
// because "media/…" was resolved as "/en/media/…" → 404.
const FOTO_DRONE  = (n) => `/media/optimized/fotos-drone/${_slug(n)}.jpg`;
const VIDEO_DRONE = (n) => `/media/optimized/videos-drone/${_slug(n)}.mp4`;
const FOTO_RB     = (n) => `/media/optimized/fotos-rayban/${_slug(n)}.jpg`;
const VIDEO_RB    = (n) => `/media/optimized/videos-rayban/${_slug(n)}.mp4`;
const POSTER      = (n) => `/media/optimized/posters/${n}`;

const M = (id, type, src, title, mood, altitude, year, exif) => {
  // Auto-generate poster path for video/pov items based on the video filename.
  // The gen-all-posters.sh script creates a JPG with the same base name as the
  // video file. This ensures each video has a UNIQUE poster, solving the
  // duplicate preview issue (especially in Patagonia where all clips start
  // with a similar first frame).
  let poster = null;
  if (type === 'video' || type === 'pov') {
    const match = src.match(/\/([^/]+)\.(mp4|mov)$/i);
    if (match) {
      poster = POSTER(match[1] + '.jpg');
    }
  }
  return { id, type, src, poster, title, mood, altitude, year, exif: exif || null };
};

// Cinematic 3-clip hero sequence — sea → river → snow
const HERO_SEQUENCE = [
  {
    src: VIDEO_DRONE('Cerdeña_Isla-Magdalena_HERO.MP4'),
    poster: POSTER('cerde-na-isla-magdalena-hero.jpg'),
    label: { en: 'Maddalena, Sardinia', es: 'Maddalena, Cerdeña', it: 'Maddalena, Sardegna' },
  },
  {
    src: VIDEO_DRONE('Rio_Limay_Patagonia.MP4'),
    poster: POSTER('rio-limay-patagonia.jpg'),
    label: { en: 'Río Limay, Patagonia', es: 'Río Limay, Patagonia', it: 'Río Limay, Patagonia' },
  },
  {
    src: VIDEO_DRONE('Atardecer-Nieve-HERO.mov'),
    poster: POSTER('atardecer-nieve-hero.jpg'),
    label: { en: 'Trentino, Italian Alps', es: 'Trentino, Alpes Italianos', it: 'Trentino, Alpi Italiane' },
  },
];

const LOCATIONS_V2 = [
  // ===== ITALIA =====
  {
    id: 'cerdena',
    name: { en: 'Sardinia', es: 'Cerdeña', it: 'Sardegna' },
    country: { en: 'Italy', es: 'Italia', it: 'Italia' },
    flag: '🇮🇹',
    coords: { lat: 41.207, lng: 9.405 },
    cover: FOTO_DRONE('Cerdeña_Magdalena.JPG'),
    accentColor: '#1E6FA4',
    year: 2025,
    description: {
      en: 'The Maddalena archipelago — turquoise water, granite islands, the Mediterranean at its most cinematic.',
      es: 'El archipiélago de la Maddalena — agua turquesa, islas de granito, el Mediterráneo en su versión más cinematográfica.',
      it: 'L\'arcipelago della Maddalena — acqua turchese, isole di granito, il Mediterraneo nella sua versione più cinematografica.',
    },
    media: [
      M('cer-1', 'photo', FOTO_DRONE('Cerdeña_Magdalena.JPG'), {en:'Maddalena Dusk',es:'Maddalena al ocaso',it:'Maddalena al tramonto'}, 'golden', 'aerial', 2024, {camera:'DJI Mini 4 Pro', loc:'La Maddalena, IT'}),
      M('cer-2', 'photo', FOTO_DRONE('Cerdeña-Isla_Magdalena.JPG'), {en:'Maddalena Island',es:'Isla Maddalena',it:'Isola Maddalena'}, 'oceanic', 'aerial', 2024, {camera:'DJI Mini 4 Pro', loc:'La Maddalena, IT'}),
      M('cer-3', 'photo', FOTO_DRONE('Cerdeña_Amigos.JPG'), {en:'Friends, Sardinia',es:'Amigos, Cerdeña',it:'Amici, Sardegna'}, 'oceanic', 'aerial', 2024),
      M('cer-4', 'photo', FOTO_RB('Cerdeña-Golfo_Aranci-Isla.jpg'), {en:'Golfo Aranci POV',es:'Golfo Aranci POV',it:'Golfo Aranci POV'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
      M('cer-5', 'photo', FOTO_RB('Cerdeña_Golfo-Aranci.jpg'), {en:'Golfo Aranci',es:'Golfo Aranci',it:'Golfo Aranci'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
      M('cer-v1', 'video', VIDEO_DRONE('Cerdeña_Velero.MP4'), {en:'Sailboat, Costa Smeralda',es:'Velero, Costa Smeralda',it:'Veliero, Costa Smeralda'}, 'oceanic', 'aerial', 2024),
      M('cer-v2', 'video', VIDEO_DRONE('Cerdeña_Isla-Magdalena_HERO.MP4'), {en:'Maddalena Aerial',es:'Maddalena aérea',it:'Maddalena aerea'}, 'golden', 'aerial', 2024),
      M('cer-v3', 'video', VIDEO_DRONE('Cerdeña_Golfo-Aranci.MP4'), {en:'Golfo Aranci',es:'Golfo Aranci',it:'Golfo Aranci'}, 'oceanic', 'aerial', 2024),
      M('cer-v4', 'video', VIDEO_DRONE('Cerdeña_Magdalena-isla_Hotel.MP4'), {en:'Hotel, Maddalena',es:'Hotel, Maddalena',it:'Hotel, Maddalena'}, 'oceanic', 'aerial', 2024),
      M('cer-v5', 'video', VIDEO_DRONE('Cerdeña_Spiaggia_Cala_Sassari.MP4'), {en:'Cala Sassari',es:'Cala Sassari',it:'Cala Sassari'}, 'oceanic', 'aerial', 2024),
      M('cer-v6', 'video', VIDEO_DRONE('Cerdeña_Spiaggia-Biancha.MP4'), {en:'Spiaggia Bianca',es:'Spiaggia Bianca',it:'Spiaggia Bianca'}, 'oceanic', 'aerial', 2024),
      M('cer-v7', 'video', VIDEO_DRONE('Cerdeña-Magdalena_Barcos.MP4'), {en:'Boats at Anchor',es:'Barcos fondeados',it:'Barche all\'ancora'}, 'oceanic', 'aerial', 2024),
      M('cer-v8', 'video', VIDEO_DRONE('Cerdeña-Spiaggia_Cala_Sabina.MP4'), {en:'Cala Sabina',es:'Cala Sabina',it:'Cala Sabina'}, 'oceanic', 'aerial', 2024),
    ]
  },
  {
    id: 'alpes',
    name: { en: 'Italian Alps', es: 'Alpes Italianos', it: 'Alpi Italiane' },
    country: { en: 'Italy', es: 'Italia', it: 'Italia' },
    flag: '🇮🇹',
    coords: { lat: 46.499, lng: 11.349 },
    cover: FOTO_DRONE('Atardecer_Alpes.JPG'),
    accentColor: '#8FA8C0',
    year: 2026,
    description: {
      en: 'Trentino, Dolomites — sea of clouds, alpine dusk, snow at golden hour.',
      es: 'Trentino, Dolomitas — mar de nubes, ocaso alpino, nieve en hora dorada.',
      it: 'Trentino, Dolomiti — mare di nuvole, tramonto alpino, neve nell\'ora dorata.',
    },
    media: [
      M('alp-1', 'photo', FOTO_DRONE('Atardecer_Alpes.JPG'), {en:'Alps at Dusk',es:'Alpes al ocaso',it:'Alpi al tramonto'}, 'golden', 'mountain', 2024, {camera:'DJI Mini 4 Pro', loc:'Trentino, IT'}),
      M('alp-2', 'photo', FOTO_DRONE('Atardecer_Alpes_IT.JPG'), {en:'Italian Sunset',es:'Atardecer italiano',it:'Tramonto italiano'}, 'golden', 'mountain', 2024),
      M('alp-3', 'photo', FOTO_DRONE('Alpes_Dolomitas.JPG'), {en:'The Dolomites',es:'Las Dolomitas',it:'Le Dolomiti'}, 'cold', 'mountain', 2024),
      M('alp-4', 'photo', FOTO_DRONE('Atardecer_Arriba-del-Cielo.JPG'), {en:'Above the Clouds',es:'Sobre las nubes',it:'Sopra le nuvole'}, 'golden', 'aerial', 2024),
      M('alp-v1', 'video', VIDEO_DRONE('Atardecer-Nieve-HERO.mov'), {en:'Snow at Golden Hour',es:'Nieve en hora dorada',it:'Neve nell\'ora dorata'}, 'golden', 'mountain', 2024),
      M('alp-v2', 'video', VIDEO_DRONE('Alpes_Italianos_Atardecer.mov'), {en:'Alps Sunset',es:'Atardecer Alpes',it:'Tramonto Alpi'}, 'golden', 'mountain', 2024),
      M('alp-v3', 'video', VIDEO_DRONE('Alpes_Italianos.mov'), {en:'Italian Alps',es:'Alpes italianos',it:'Alpi italiane'}, 'cold', 'mountain', 2024),
      M('alp-v4', 'video', VIDEO_DRONE('Alpes_Italianos_trentino.MP4'), {en:'Trentino',es:'Trentino',it:'Trentino'}, 'cold', 'mountain', 2024),
      M('alp-v5', 'video', VIDEO_DRONE('Alpes_Italianos_Dolomitas-Perro.MP4'), {en:'Dog in the Dolomites',es:'Perro en las Dolomitas',it:'Cane nelle Dolomiti'}, 'cold', 'mountain', 2024),
      M('alp-v6', 'video', VIDEO_DRONE('Atardecer-Nieve_Alpes-Italianos-Trentino.MP4'), {en:'Trentino Snow',es:'Nieve en Trentino',it:'Neve in Trentino'}, 'golden', 'mountain', 2024),
      M('alp-v7', 'video', VIDEO_DRONE('Alpes_Italianos_Dolomitas-9:16.mov'), {en:'Dolomites Vertical',es:'Dolomitas vertical',it:'Dolomiti verticale'}, 'cold', 'mountain', 2024),
      M('alp-v8', 'pov', VIDEO_RB('Paseo-Perro_Alpes_IT.MOV'), {en:'Walking the Dog, Alps',es:'Paseo con el perro',it:'Passeggiata col cane'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('alp-v9', 'pov', VIDEO_RB('Ski-Alpes_Italia.mov'), {en:'Skiing the Alps',es:'Esquiando los Alpes',it:'Sciando sulle Alpi'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  {
    id: 'roma',
    name: { en: 'Rome', es: 'Roma', it: 'Roma' },
    country: { en: 'Italy', es: 'Italia', it: 'Italia' },
    flag: '🇮🇹',
    coords: { lat: 41.890, lng: 12.492 },
    cover: FOTO_RB('Templo_Wat-Phra-Kaew-Thai.jpeg'), // updated below if better
    accentColor: '#C9A227',
    year: 2025,
    description: {
      en: 'The Forum, the Colosseum — eternal stone, walking the bones of the empire.',
      es: 'El Foro, el Coliseo — piedra eterna, caminando los huesos del imperio.',
      it: 'Il Foro, il Colosseo — pietra eterna, camminando sulle ossa dell\'impero.',
    },
    media: [
      M('rom-v1', 'pov', VIDEO_RB('Coliseo-Roma.mov'), {en:'Colosseum',es:'Coliseo',it:'Colosseo'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta', loc:'Roma, IT'}),
      M('rom-v2', 'pov', VIDEO_RB('Foro-Romano_Roma.mov'), {en:'Roman Forum',es:'Foro Romano',it:'Foro Romano'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  {
    id: 'calabria',
    name: { en: 'Calabria', es: 'Calabria', it: 'Calabria' },
    country: { en: 'Italy', es: 'Italia', it: 'Italia' },
    flag: '🇮🇹',
    coords: { lat: 39.296, lng: 16.253 },
    cover: FOTO_DRONE('Pueblito-Calabria.JPG'),
    accentColor: '#B85C38',
    year: 2025,
    description: {
      en: 'Hilltop villages, Vesuvius on the horizon, monasteries cut into rock.',
      es: 'Pueblos en colinas, el Vesubio en el horizonte, monasterios tallados en roca.',
      it: 'Villaggi in collina, il Vesuvio all\'orizzonte, monasteri scavati nella roccia.',
    },
    media: [
      M('cal-1', 'photo', FOTO_DRONE('Pueblito-Calabria.JPG'), {en:'Calabrian Village',es:'Pueblito calabrés',it:'Villaggio calabrese'}, 'warm', 'mountain', 2024),
      M('cal-v1', 'video', VIDEO_DRONE('Atardecer_Calabria-Vesubio-al-fondo.MP4'), {en:'Vesuvius Backdrop',es:'Vesubio al fondo',it:'Vesuvio sullo sfondo'}, 'golden', 'aerial', 2024),
      M('cal-v2', 'video', VIDEO_DRONE('Monasterio-Calabria-Epic_Italy.MP4'), {en:'Monastery',es:'Monasterio',it:'Monastero'}, 'warm', 'aerial', 2024),
      M('cal-v3', 'video', VIDEO_DRONE('Castillo-Calabria_9:16.mov'), {en:'Castle, Vertical',es:'Castillo vertical',it:'Castello verticale'}, 'warm', 'aerial', 2024),
    ]
  },
  // ===== ARGENTINA =====
  {
    id: 'patagonia',
    name: { en: 'Patagonia', es: 'Patagonia', it: 'Patagonia' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -41.133, lng: -71.310 },
    cover: FOTO_DRONE('Valle_Encantado-Patagonia.JPG'),
    accentColor: '#2D7A4A',
    year: 2025,
    description: {
      en: 'Bariloche, Neuquén — the Limay river, enchanted valleys, Patagonian forests.',
      es: 'Bariloche, Neuquén — el río Limay, valles encantados, bosques patagónicos.',
      it: 'Bariloche, Neuquén — il fiume Limay, valli incantate, foreste patagoniche.',
    },
    media: [
      M('pat-1', 'photo', FOTO_DRONE('Valle_Encantado-Patagonia.JPG'), {en:'Enchanted Valley',es:'Valle Encantado',it:'Valle Incantata'}, 'cold', 'mountain', 2024, {camera:'DJI Mini 4 Pro', loc:'Valle Encantado, AR'}),
      M('pat-2', 'photo', FOTO_DRONE('Rio_Limay-Patagonia.JPG'), {en:'Limay River',es:'Río Limay',it:'Fiume Limay'}, 'cold', 'aerial', 2024),
      M('pat-v1', 'video', VIDEO_DRONE('Bosque_Patagonia-Argentina.MP4'), {en:'Patagonian Forest',es:'Bosque patagónico',it:'Foresta patagonica'}, 'cold', 'aerial', 2024),
      M('pat-v2', 'video', VIDEO_DRONE('Rio_Limay_Patagonia.MP4'), {en:'Río Limay',es:'Río Limay',it:'Río Limay'}, 'cold', 'aerial', 2024),
      M('pat-v3', 'video', VIDEO_DRONE('Valle_Encantado_rio-Limay.MP4'), {en:'Enchanted Valley',es:'Valle Encantado',it:'Valle Incantata'}, 'cold', 'aerial', 2024),
      M('pat-v4', 'video', VIDEO_DRONE('Valle_Encantado-Rio_Limay.MP4'), {en:'Limay Valley',es:'Valle del Limay',it:'Valle del Limay'}, 'cold', 'aerial', 2024),
      M('pat-v5', 'video', VIDEO_DRONE('Villa-Pehuenia_Neuquen.MP4'), {en:'Villa Pehuenia',es:'Villa Pehuenia',it:'Villa Pehuenia'}, 'cold', 'mountain', 2024),
      M('pat-v6', 'video', VIDEO_DRONE('Villa_Pehuenia-Patagonia-9:16.mov'), {en:'Pehuenia Vertical',es:'Pehuenia vertical',it:'Pehuenia verticale'}, 'cold', 'mountain', 2024),
      M('pat-v7', 'pov', VIDEO_RB('Bariloche_Mirador-Circuito-Chico.MOV'), {en:'Circuito Chico Vista',es:'Mirador Circuito Chico',it:'Belvedere Circuito Chico'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('pat-v8', 'pov', VIDEO_RB('Kayak-Bariloche.mp4'), {en:'Kayak, Bariloche',es:'Kayak en Bariloche',it:'Kayak a Bariloche'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  {
    id: 'jujuy',
    name: { en: 'Jujuy & Salta', es: 'Jujuy y Salta', it: 'Jujuy e Salta' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -23.625, lng: -65.875 },
    cover: FOTO_RB('Salinas_Grandes-Jujuy.jpg'),
    accentColor: '#D97757',
    year: 2025,
    description: {
      en: 'Cerro de los 7 Colores, Salinas Grandes, El Hornocal — high desert, layered rock, salt flats.',
      es: 'Cerro de los 7 Colores, Salinas Grandes, El Hornocal — alta puna, roca estratificada, salares.',
      it: 'Cerro de los 7 Colores, Salinas Grandes, El Hornocal — alta puna, roccia stratificata, saline.',
    },
    media: [
      M('juj-1', 'photo', FOTO_RB('Salinas_Grandes-Jujuy.jpg'), {en:'Salinas Grandes',es:'Salinas Grandes',it:'Salinas Grandes'}, 'warm', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('juj-v1', 'video', VIDEO_DRONE('Cerro_7colores.mov'), {en:'Cerro de los 7 Colores',es:'Cerro de los 7 Colores',it:'Cerro de los 7 Colores'}, 'warm', 'mountain', 2024),
      M('juj-v2', 'video', VIDEO_DRONE('Cerro7Colores_Jujuy.mov'), {en:'7 Colores',es:'7 Colores',it:'7 Colores'}, 'warm', 'mountain', 2024),
      M('juj-v3', 'video', VIDEO_DRONE('El_Hornacal.MP4'), {en:'El Hornocal',es:'El Hornocal',it:'El Hornocal'}, 'warm', 'aerial', 2024),
      M('juj-v4', 'video', VIDEO_DRONE('El_Hornacal-9:16.mov'), {en:'El Hornocal Vertical',es:'El Hornocal vertical',it:'El Hornocal verticale'}, 'warm', 'aerial', 2024),
      M('juj-v5', 'video', VIDEO_DRONE('Paseo-de-los-Angeles_Jujuy.mov'), {en:'Paseo de los Ángeles',es:'Paseo de los Ángeles',it:'Paseo de los Ángeles'}, 'warm', 'aerial', 2024),
      M('juj-v6', 'video', VIDEO_DRONE('Pumamarca_Jujuy.mov'), {en:'Purmamarca',es:'Purmamarca',it:'Purmamarca'}, 'warm', 'mountain', 2024),
      M('juj-v7', 'video', VIDEO_DRONE('Ruta-de-la-Cornisa_Salta-Jujuy.mov'), {en:'Cornisa Route',es:'Ruta de la Cornisa',it:'Ruta de la Cornisa'}, 'green', 'mountain', 2024),
      M('juj-v8', 'pov', VIDEO_RB('Jujuy_Montaña.mp4'), {en:'Jujuy Mountain',es:'Montaña, Jujuy',it:'Montagna, Jujuy'}, 'warm', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('juj-v9', 'pov', VIDEO_RB('Jujuy_Tilcara-Compra-Tortilla.MOV'), {en:'Tortilla Stand, Tilcara',es:'Tortilla en Tilcara',it:'Tortilla a Tilcara'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  {
    id: 'cordoba',
    name: { en: 'Córdoba', es: 'Córdoba', it: 'Córdoba' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -31.418, lng: -64.183 },
    cover: FOTO_DRONE('Carlos-Paz_Cba.JPG'),
    accentColor: '#7B8B6F',
    year: 2025,
    description: {
      en: 'Sierras, lakes, the open countryside — Carlos Paz, James Craik, Los Gigantes.',
      es: 'Sierras, lagos, el campo abierto — Carlos Paz, James Craik, Los Gigantes.',
      it: 'Sierras, laghi, la campagna aperta — Carlos Paz, James Craik, Los Gigantes.',
    },
    media: [
      M('cor-1', 'photo', FOTO_DRONE('Carlos-Paz_Cba.JPG'), {en:'Carlos Paz',es:'Carlos Paz',it:'Carlos Paz'}, 'warm', 'aerial', 2024),
      M('cor-2', 'photo', FOTO_RB('James_Craik-Cordoba.jpeg'), {en:'James Craik, Córdoba',es:'James Craik, Córdoba',it:'James Craik, Córdoba'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('cor-v1', 'video', VIDEO_DRONE('Carlos_Paz-Cordoba.MP4'), {en:'Carlos Paz',es:'Carlos Paz',it:'Carlos Paz'}, 'warm', 'aerial', 2024),
      M('cor-v2', 'video', VIDEO_DRONE('Laguna_"La-Chanchera"_Cordoba.mov'), {en:'La Chanchera Lagoon',es:'Laguna La Chanchera',it:'Laguna La Chanchera'}, 'cold', 'aerial', 2024),
      M('cor-v3', 'video', VIDEO_DRONE('James-Craik_Tren-9:16.mov'), {en:'Train, James Craik',es:'Tren, James Craik',it:'Treno, James Craik'}, 'warm', 'aerial', 2024),
      M('cor-v4', 'pov', VIDEO_RB('Campo_James-Craik_Cordoba.mov'), {en:'James Craik Fields',es:'Campo James Craik',it:'Campagna James Craik'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('cor-v5', 'pov', VIDEO_RB('Sierras-Cba_Los-Gigantes.mov'), {en:'Los Gigantes',es:'Los Gigantes',it:'Los Gigantes'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  {
    id: 'mendoza',
    name: { en: 'Mendoza · Andes', es: 'Mendoza · Andes', it: 'Mendoza · Ande' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -32.889, lng: -68.845 },
    cover: FOTO_RB('Los_Andes-Avion.jpeg'),
    accentColor: '#9CA8B8',
    year: 2024,
    description: {
      en: 'The Andes from above — vertical drop, blue shadows on white, the spine of South America.',
      es: 'Los Andes desde arriba — caída vertical, sombras azules sobre el blanco, la columna de Sudamérica.',
      it: 'Le Ande dall\'alto — caduta verticale, ombre blu sul bianco, la spina dorsale del Sudamerica.',
    },
    media: [
      M('men-1', 'photo', FOTO_RB('Los_Andes-Avion.jpeg'), {en:'Andes from Above',es:'Andes desde el aire',it:'Ande dall\'alto'}, 'cold', 'aerial', 2024, {camera:'Ray-Ban Meta', loc:'Cordillera de los Andes'}),
    ]
  },
  {
    id: 'mdp',
    name: { en: 'Mar del Plata', es: 'Mar del Plata', it: 'Mar del Plata' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -38.005, lng: -57.542 },
    cover: FOTO_DRONE('Carlos-Paz_Cba.JPG'),
    accentColor: '#5B7C99',
    year: 2025,
    description: {
      en: 'Home. The Atlantic, the open horizon — where every flight starts.',
      es: 'Casa. El Atlántico, el horizonte abierto — donde empieza cada vuelo.',
      it: 'Casa. L\'Atlantico, l\'orizzonte aperto — dove inizia ogni volo.',
    },
    media: [
      M('mdp-v1', 'video', VIDEO_DRONE('Mar_Del_Plata.mov'), {en:'Mar del Plata',es:'Mar del Plata',it:'Mar del Plata'}, 'cold', 'aerial', 2024),
    ]
  },
  {
    id: 'laslenas',
    name: { en: 'Las Leñas', es: 'Las Leñas', it: 'Las Leñas' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -35.155, lng: -70.085 },
    cover: FOTO_DRONE('Atardecer_Alpes.JPG'),
    accentColor: '#8FA8C0',
    year: 2025,
    description: {
      en: 'High Andes, Mendoza — vertical drop, blue shadows on white.',
      es: 'Alta cordillera, Mendoza — caída vertical, sombras azules sobre el blanco.',
      it: 'Alta cordigliera, Mendoza — caduta verticale, ombre blu sul bianco.',
    },
    media: [
      M('lln-v1', 'video', VIDEO_DRONE('Las_Leñas-9:16.mov'), {en:'Las Leñas Vertical',es:'Las Leñas vertical',it:'Las Leñas verticale'}, 'cold', 'mountain', 2024),
    ]
  },
  // ===== MARRUECOS =====
  {
    id: 'marruecos',
    name: { en: 'Morocco', es: 'Marruecos', it: 'Marocco' },
    country: { en: 'Morocco', es: 'Marruecos', it: 'Marocco' },
    flag: '🇲🇦',
    coords: { lat: 30.523, lng: -9.692 },
    cover: FOTO_DRONE('Aghroud_Marruecos.JPG'),
    accentColor: '#C9A227',
    year: 2025,
    description: {
      en: 'Aghroud, Taghazout, Marrakech — Atlantic surf coast, dyers in the medina, motorcycle south.',
      es: 'Aghroud, Taghazout, Marrakech — costa de surf atlántica, tintoreros en la medina, moto al sur.',
      it: 'Aghroud, Taghazout, Marrakech — costa atlantica del surf, tintori nella medina, moto verso sud.',
    },
    media: [
      M('mar-1', 'photo', FOTO_DRONE('Aghroud_Marruecos.JPG'), {en:'Aghroud Coast',es:'Costa de Aghroud',it:'Costa di Aghroud'}, 'warm', 'aerial', 2023),
      M('mar-3', 'photo', FOTO_RB('Marruecos-Tintes_Marrakech.jpg'), {en:'Dyers, Marrakech',es:'Tintoreros, Marrakech',it:'Tintori, Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-4', 'photo', FOTO_RB('Taghazout-Marruecos.jpg'), {en:'Taghazout',es:'Taghazout',it:'Taghazout'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v1', 'video', VIDEO_DRONE('Aghroud_Marruecos.MP4'), {en:'Aghroud',es:'Aghroud',it:'Aghroud'}, 'warm', 'aerial', 2023),
      M('mar-v2', 'video', VIDEO_DRONE('Aghroud-panoramica.MP4'), {en:'Aghroud Panoramic',es:'Aghroud panorámica',it:'Aghroud panoramica'}, 'warm', 'aerial', 2023),
      M('mar-v3', 'video', VIDEO_DRONE('Taghazout_Marruecos.MP4'), {en:'Taghazout Surf',es:'Taghazout surf',it:'Taghazout surf'}, 'oceanic', 'aerial', 2023),
      M('mar-v4', 'pov', VIDEO_RB('Agadir_Marruecos-Moto.MOV'), {en:'Agadir on Motorcycle',es:'Agadir en moto',it:'Agadir in moto'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v5', 'pov', VIDEO_RB('Marrakech_Centro-Callecitas.mov'), {en:'Marrakech Alleys',es:'Callecitas Marrakech',it:'Vicoli di Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v6', 'pov', VIDEO_RB('Marrakech_Centro.MOV'), {en:'Marrakech Center',es:'Centro Marrakech',it:'Centro Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v7', 'pov', VIDEO_RB('Marrakech-Paseo-Centro.mov'), {en:'Marrakech Walk',es:'Paseo Marrakech',it:'Passeggiata Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v8', 'pov', VIDEO_RB('Viaje-Moto_Sur_Marruecos.MOV'), {en:'South Morocco Ride',es:'Sur de Marruecos en moto',it:'Sud del Marocco in moto'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
    ]
  },
  // ===== PAÍSES BAJOS =====
  {
    id: 'amsterdam',
    name: { en: 'Amsterdam', es: 'Ámsterdam', it: 'Amsterdam' },
    country: { en: 'Netherlands', es: 'Países Bajos', it: 'Paesi Bassi' },
    flag: '🇳🇱',
    coords: { lat: 52.370, lng: 4.895 },
    cover: FOTO_DRONE('Atardecer_Arriba-del-Cielo.JPG'),
    accentColor: '#6B4C7F',
    year: 2025,
    description: {
      en: 'Canals, bicycles, Zaandam, the Rijksmuseum — Dutch light and quiet repetition.',
      es: 'Canales, bicicletas, Zaandam, el Rijksmuseum — luz holandesa y repetición tranquila.',
      it: 'Canali, biciclette, Zaandam, il Rijksmuseum — luce olandese e quieta ripetizione.',
    },
    media: [
      M('ams-v1', 'video', VIDEO_DRONE('Amsterdam.mov'), {en:'Amsterdam',es:'Ámsterdam',it:'Amsterdam'}, 'cold', 'aerial', 2024),
      M('ams-v2', 'video', VIDEO_DRONE('Amsterdam_Parque-Zaandam.MP4'), {en:'Zaandam Park',es:'Parque Zaandam',it:'Parco Zaandam'}, 'green', 'aerial', 2024),
      M('ams-v3', 'video', VIDEO_DRONE('Zaanse Schans_Amsterdam.MP4'), {en:'Zaanse Schans',es:'Zaanse Schans',it:'Zaanse Schans'}, 'cold', 'aerial', 2024),
      M('ams-v4', 'pov', VIDEO_RB('Amsterdam_Centro-Bici.mov'), {en:'Bike Through Center',es:'Centro en bici',it:'Centro in bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v5', 'pov', VIDEO_RB('Amsterdam-Centro.mov'), {en:'Center Walk',es:'Paseo centro',it:'Passeggiata centro'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v6', 'pov', VIDEO_RB('Albert-Cuyp-Market_Amsterdam.mov'), {en:'Albert Cuyp Market',es:'Mercado Albert Cuyp',it:'Mercato Albert Cuyp'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v7', 'pov', VIDEO_RB('Palacio-Real_Amsterdam.mov'), {en:'Royal Palace',es:'Palacio Real',it:'Palazzo Reale'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v8', 'pov', VIDEO_RB('Paseo-Amsterdam-Centro.mov'), {en:'Center Walk',es:'Paseo centro',it:'Passeggiata centro'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v9', 'pov', VIDEO_RB('Rijksmuseum_Amsterdam.mov'), {en:'Rijksmuseum',es:'Rijksmuseum',it:'Rijksmuseum'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v10', 'pov', VIDEO_RB('Torre-de-la-Moneda_Amsterdam-Paseo.mov'), {en:'Mint Tower',es:'Torre de la Moneda',it:'Torre della Moneta'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v11', 'pov', VIDEO_RB('Zaandam-Centro.mov'), {en:'Zaandam',es:'Zaandam',it:'Zaandam'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v12', 'pov', VIDEO_RB('Zaandam-Paseo.mov'), {en:'Zaandam Walk',es:'Paseo Zaandam',it:'Passeggiata Zaandam'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  // ===== ALEMANIA =====
  {
    id: 'munich',
    name: { en: 'Munich', es: 'Múnich', it: 'Monaco di Baviera' },
    country: { en: 'Germany', es: 'Alemania', it: 'Germania' },
    flag: '🇩🇪',
    coords: { lat: 48.137, lng: 11.575 },
    cover: FOTO_RB('Marienplatz-Munich.jpg'),
    accentColor: '#525252',
    year: 2026,
    description: {
      en: 'Marienplatz at dusk, bikes through the old town, Bavarian sunsets.',
      es: 'Marienplatz al ocaso, bicis por el casco histórico, atardeceres bávaros.',
      it: 'Marienplatz al tramonto, bici nel centro storico, tramonti bavaresi.',
    },
    media: [
      M('mun-1', 'photo', FOTO_RB('Marienplatz-Munich.jpg'), {en:'Marienplatz',es:'Marienplatz',it:'Marienplatz'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v1', 'video', VIDEO_DRONE('Munich_Atardecer.MP4'), {en:'Munich Sunset',es:'Atardecer Múnich',it:'Tramonto Monaco'}, 'golden', 'aerial', 2024),
      M('mun-v2', 'pov', VIDEO_RB('Marienplatz-Munich.MOV'), {en:'Marienplatz POV',es:'Marienplatz POV',it:'Marienplatz POV'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v3', 'pov', VIDEO_RB('Munich_Bici-Paseo.MOV'), {en:'Munich Bike Ride',es:'Múnich en bici',it:'Monaco in bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v4', 'pov', VIDEO_RB('Munich-Giro-Bici.MOV'), {en:'Munich by Bike',es:'Vuelta en bici',it:'Giro in bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v5', 'pov', VIDEO_RB('Paseo_Munich.mov'), {en:'Munich Walk',es:'Paseo Múnich',it:'Passeggiata Monaco'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
    ]
  },
  // ===== TAILANDIA =====
  {
    id: 'tailandia',
    name: { en: 'Thailand', es: 'Tailandia', it: 'Tailandia' },
    country: { en: 'Thailand', es: 'Tailandia', it: 'Tailandia' },
    flag: '🇹🇭',
    coords: { lat: 13.756, lng: 100.501 },
    cover: FOTO_RB('Bangkok-Thai.jpeg'),
    accentColor: '#D97757',
    year: 2025,
    description: {
      en: 'Bangkok, Chiang Mai, Phuket, Ko Yao Noi — temples, rice fields, motorcycles, elephants.',
      es: 'Bangkok, Chiang Mai, Phuket, Ko Yao Noi — templos, arrozales, motos, elefantes.',
      it: 'Bangkok, Chiang Mai, Phuket, Ko Yao Noi — templi, risaie, moto, elefanti.',
    },
    media: [
      M('tha-1', 'photo', FOTO_RB('Bangkok-Thai.jpeg'), {en:'Bangkok',es:'Bangkok',it:'Bangkok'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-2', 'photo', FOTO_RB('Templo_Wat-Phra-Kaew-Thai.jpeg'), {en:'Wat Phra Kaew',es:'Wat Phra Kaew',it:'Wat Phra Kaew'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v1', 'pov', VIDEO_RB('7-Eleven_Thailandia-Chiang_Mai.mov'), {en:'7-Eleven, Chiang Mai',es:'7-Eleven Chiang Mai',it:'7-Eleven, Chiang Mai'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v2', 'pov', VIDEO_RB('Bangkok_Viaje-Moto.mov'), {en:'Bangkok by Motorcycle',es:'Bangkok en moto',it:'Bangkok in moto'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v3', 'pov', VIDEO_RB('Elefantes-Thailandia.mov'), {en:'Elephants',es:'Elefantes',it:'Elefanti'}, 'green', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v4', 'pov', VIDEO_RB('Infierno-Cielo_Templo-Blanco-Thai.mov'), {en:'White Temple, Inner View',es:'Templo Blanco, vista interior',it:'Tempio Bianco, vista interna'}, 'cold', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v5', 'pov', VIDEO_RB('Ko-Yao-Noi_Campos-Arroz-Thai.mp4'), {en:'Rice Fields, Ko Yao Noi',es:'Arrozales, Ko Yao Noi',it:'Risaie, Ko Yao Noi'}, 'green', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v6', 'pov', VIDEO_RB('Panwa-Beach_Phuket_Thai.mov'), {en:'Panwa Beach, Phuket',es:'Playa Panwa, Phuket',it:'Spiaggia Panwa, Phuket'}, 'oceanic', 'water', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v7', 'pov', VIDEO_RB('Templo_Buda-Acostado_Thai.mov'), {en:'Reclining Buddha',es:'Buda Reclinado',it:'Buddha Sdraiato'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v8', 'pov', VIDEO_RB('Templo_Wat-Pho_Thai.mov'), {en:'Wat Pho',es:'Wat Pho',it:'Wat Pho'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v9', 'pov', VIDEO_RB('Templo-Blanco_Thailandia.mov'), {en:'White Temple',es:'Templo Blanco',it:'Tempio Bianco'}, 'cold', 'street', 2025, {camera:'Ray-Ban Meta'}),
    ]
  },
];

// CIRCUIT BREAKER: filtrar items cuyo asset NO existe en /optimized/
// Evita que el browser cargue cientos de 404s y crashee.
// Si window.RANUK_ASSETS no está definido, no filtra (modo dev).
if (window.RANUK_ASSETS && window.RANUK_ASSETS.size > 0) {
  let dropped = 0;
  LOCATIONS_V2.forEach(loc => {
    loc.media = loc.media.filter(m => {
      const ok = window.RANUK_ASSETS.has(m.src);
      if (!ok) dropped++;
      return ok;
    });
    // si el cover de la location no existe, usar el primer media disponible
    if (loc.cover && !window.RANUK_ASSETS.has(loc.cover)) {
      const firstPhoto = loc.media.find(m => m.type === 'photo');
      loc.cover = firstPhoto ? firstPhoto.src : (loc.media[0] ? loc.media[0].src : loc.cover);
    }
  });
  // remover locations que quedaron sin media
  for (let i = LOCATIONS_V2.length - 1; i >= 0; i--) {
    if (LOCATIONS_V2[i].media.length === 0) LOCATIONS_V2.splice(i, 1);
  }
  // filtrar HERO_SEQUENCE también
  for (let i = HERO_SEQUENCE.length - 1; i >= 0; i--) {
    if (!window.RANUK_ASSETS.has(HERO_SEQUENCE[i].src)) HERO_SEQUENCE.splice(i, 1);
  }
  if (dropped > 0) console.info('[ranuk] manifest: dropped', dropped, 'items pending optimization');
}

// Cada media hereda el location ref. Year propio del media se preserva (era sobrescrito antes).
LOCATIONS_V2.forEach(loc => {
  loc.media.forEach(m => {
    if (m.year == null) m.year = loc.year;
    m.location = { id: loc.id, name: loc.name, flag: loc.flag, year: loc.year };
  });
});

// ─── POSTER STRATEGY v3 (honest previews) ────────────────────────────────
// El problema con v2: cuando un video no tenía poster dedicado, el algoritmo
// rotaba entre fotos arbitrarias de la misma location. Resultado: el preview
// mostraba una foto del Golfo Aranci pero al abrir el video aparecía
// Cala Sabina. La relación preview ↔ contenido era ficticia.
//
// Nueva estrategia:
//   1. Poster dedicado en /media/optimized/posters/<basename>.jpg → usarlo.
//      Estos son frames REALES del video, tomados con ffmpeg en build time.
//   2. Match fuerte (>=0.6) por tokens contra una foto de la location →
//      usarlo y marcar `_posterMatch = 'photo'`. Sólo captura pares donde
//      el basename del video y la foto comparten la mayoría de los tokens
//      (ej. "Cerdeña_Golfo-Aranci.MP4" ↔ "Cerdeña_Golfo-Aranci.jpg").
//      Elevé el threshold de 0.5 → 0.6 para reducir falsos positivos.
//   3. Si NO hay match honesto: usar el cover de la location con marca
//      `_posterMatch = 'fallback'`. El frontend renderiza esta tile con un
//      tratamiento distinto (overlay oscuro + título del video superpuesto)
//      para dejar claro que el preview es una referencia de lugar, NO un
//      frame del contenido. Nunca más mostramos una foto aleatoria como si
//      fuera el contenido real del video.
//
// Ejecuta DESPUÉS del circuit breaker: toda ruta referenciada ya existe.
const _basename = (path) => {
  const slash = path.lastIndexOf('/');
  const tail = slash >= 0 ? path.slice(slash + 1) : path;
  const dot = tail.lastIndexOf('.');
  return (dot >= 0 ? tail.slice(0, dot) : tail).toLowerCase();
};
const _tokens = (base) => base.split(/[-_]+/).filter(t => t.length >= 3);
const _matchScore = (a, b) => {
  const ta = _tokens(a), tb = _tokens(b);
  if (!ta.length || !tb.length) return 0;
  const setB = new Set(tb);
  let hits = 0;
  ta.forEach(t => { if (setB.has(t)) hits++; });
  return hits / Math.max(ta.length, tb.length);
};

LOCATIONS_V2.forEach(loc => {
  const photos = loc.media.filter(m => m.type === 'photo').map(m => m.src);
  const assets = (window.RANUK_ASSETS && typeof window.RANUK_ASSETS.has === 'function') ? window.RANUK_ASSETS : null;

  loc.media.forEach(m => {
    if (m.type === 'photo' || m.poster) return;

    const vidBase = _basename(m.src);

    // 1) Dedicated poster (real frame from video)
    if (assets) {
      const dedicated = `/media/optimized/posters/${vidBase}.jpg`;
      if (assets.has(dedicated)) {
        m.poster = dedicated;
        m._posterMatch = 'dedicated';
        return;
      }
    }

    // 2) Strong token match against a location photo
    let best = null, bestScore = 0;
    photos.forEach(p => {
      const s = _matchScore(vidBase, _basename(p));
      if (s > bestScore) { bestScore = s; best = p; }
    });
    if (best && bestScore >= 0.6) {
      m.poster = best;
      m._posterMatch = 'photo';
      return;
    }

    // 3) Honest fallback: location cover with "generic" treatment
    if (loc.cover) {
      m.poster = loc.cover;
      m._posterMatch = 'fallback';
    }
  });
});

// VISITED_DOTS_V2 — pins decorativos en el globo (paises visitados sin material)
// Click no abre lightbox, solo tooltip con nombre
const VISITED_DOTS_V2 = [
  // Europa
  { name: { en: 'Paris',          es: 'París',          it: 'Parigi' },        country: { en: 'France',       es: 'Francia',     it: 'Francia' },        flag: '🇫🇷', coords: { lat: 48.857, lng: 2.353 }   },
  { name: { en: 'Barcelona',      es: 'Barcelona',      it: 'Barcellona' },    country: { en: 'Spain',        es: 'España',      it: 'Spagna' },         flag: '🇪🇸', coords: { lat: 41.385, lng: 2.173 }   },
  { name: { en: 'Madrid',         es: 'Madrid',         it: 'Madrid' },        country: { en: 'Spain',        es: 'España',      it: 'Spagna' },         flag: '🇪🇸', coords: { lat: 40.417, lng: -3.703 }  },
  { name: { en: 'Lisbon',         es: 'Lisboa',         it: 'Lisbona' },       country: { en: 'Portugal',     es: 'Portugal',    it: 'Portogallo' },     flag: '🇵🇹', coords: { lat: 38.722, lng: -9.140 }  },
  { name: { en: 'London',         es: 'Londres',        it: 'Londra' },        country: { en: 'United Kingdom', es: 'Reino Unido', it: 'Regno Unito' }, flag: '🇬🇧', coords: { lat: 51.507, lng: -0.128 }  },
  { name: { en: 'Berlin',         es: 'Berlín',         it: 'Berlino' },       country: { en: 'Germany',      es: 'Alemania',    it: 'Germania' },       flag: '🇩🇪', coords: { lat: 52.520, lng: 13.405 }  },
  { name: { en: 'Vienna',         es: 'Viena',          it: 'Vienna' },        country: { en: 'Austria',      es: 'Austria',     it: 'Austria' },        flag: '🇦🇹', coords: { lat: 48.208, lng: 16.373 }  },
  { name: { en: 'Prague',         es: 'Praga',          it: 'Praga' },         country: { en: 'Czech Rep.',   es: 'Rep. Checa',  it: 'Rep. Ceca' },      flag: '🇨🇿', coords: { lat: 50.075, lng: 14.437 }  },
  { name: { en: 'Budapest',       es: 'Budapest',       it: 'Budapest' },      country: { en: 'Hungary',      es: 'Hungría',     it: 'Ungheria' },       flag: '🇭🇺', coords: { lat: 47.498, lng: 19.040 }  },
  { name: { en: 'Athens',         es: 'Atenas',         it: 'Atene' },         country: { en: 'Greece',       es: 'Grecia',      it: 'Grecia' },         flag: '🇬🇷', coords: { lat: 37.984, lng: 23.728 }  },
  { name: { en: 'Florence',       es: 'Florencia',      it: 'Firenze' },       country: { en: 'Italy',        es: 'Italia',      it: 'Italia' },         flag: '🇮🇹', coords: { lat: 43.770, lng: 11.255 }  },
  { name: { en: 'Venice',         es: 'Venecia',        it: 'Venezia' },       country: { en: 'Italy',        es: 'Italia',      it: 'Italia' },         flag: '🇮🇹', coords: { lat: 45.440, lng: 12.316 }  },
  { name: { en: 'Milan',          es: 'Milán',          it: 'Milano' },        country: { en: 'Italy',        es: 'Italia',      it: 'Italia' },         flag: '🇮🇹', coords: { lat: 45.464, lng: 9.190 }   },
  { name: { en: 'Brussels',       es: 'Bruselas',       it: 'Bruxelles' },     country: { en: 'Belgium',      es: 'Bélgica',     it: 'Belgio' },         flag: '🇧🇪', coords: { lat: 50.851, lng: 4.351 }   },
  { name: { en: 'Zurich',         es: 'Zúrich',         it: 'Zurigo' },        country: { en: 'Switzerland',  es: 'Suiza',       it: 'Svizzera' },       flag: '🇨🇭', coords: { lat: 47.376, lng: 8.541 }   },
  // Sudamérica
  { name: { en: 'Buenos Aires',   es: 'Buenos Aires',   it: 'Buenos Aires' },  country: { en: 'Argentina',    es: 'Argentina',   it: 'Argentina' },      flag: '🇦🇷', coords: { lat: -34.603, lng: -58.381 }},
  { name: { en: 'Rio de Janeiro', es: 'Río de Janeiro', it: 'Rio de Janeiro' },country: { en: 'Brazil',       es: 'Brasil',      it: 'Brasile' },        flag: '🇧🇷', coords: { lat: -22.907, lng: -43.173 }},
  { name: { en: 'Santiago',       es: 'Santiago',       it: 'Santiago' },      country: { en: 'Chile',        es: 'Chile',       it: 'Cile' },           flag: '🇨🇱', coords: { lat: -33.448, lng: -70.669 }},
  { name: { en: 'Montevideo',     es: 'Montevideo',     it: 'Montevideo' },    country: { en: 'Uruguay',      es: 'Uruguay',     it: 'Uruguay' },        flag: '🇺🇾', coords: { lat: -34.901, lng: -56.165 }},
  { name: { en: 'Lima',           es: 'Lima',           it: 'Lima' },          country: { en: 'Peru',         es: 'Perú',        it: 'Perù' },           flag: '🇵🇪', coords: { lat: -12.046, lng: -77.043 }},
  // Norteamérica
  { name: { en: 'New York',       es: 'Nueva York',     it: 'New York' },      country: { en: 'USA',          es: 'EE.UU.',      it: 'USA' },            flag: '🇺🇸', coords: { lat: 40.713, lng: -74.006 } },
  { name: { en: 'Miami',          es: 'Miami',          it: 'Miami' },         country: { en: 'USA',          es: 'EE.UU.',      it: 'USA' },            flag: '🇺🇸', coords: { lat: 25.762, lng: -80.192 } },
  { name: { en: 'Mexico City',    es: 'Ciudad de México',it:'Città del Messico'},country:{ en: 'Mexico',       es: 'México',      it: 'Messico' },        flag: '🇲🇽', coords: { lat: 19.433, lng: -99.133 } },
  // Asia / Medio Oriente
  { name: { en: 'Dubai',          es: 'Dubái',          it: 'Dubai' },         country: { en: 'UAE',          es: 'EAU',         it: 'EAU' },            flag: '🇦🇪', coords: { lat: 25.276, lng: 55.296 }  },
  { name: { en: 'Istanbul',       es: 'Estambul',       it: 'Istanbul' },      country: { en: 'Turkey',       es: 'Turquía',     it: 'Turchia' },        flag: '🇹🇷', coords: { lat: 41.008, lng: 28.978 }  },
  { name: { en: 'Tokyo',          es: 'Tokio',          it: 'Tokyo' },         country: { en: 'Japan',        es: 'Japón',       it: 'Giappone' },       flag: '🇯🇵', coords: { lat: 35.689, lng: 139.692 } },
  { name: { en: 'Singapore',      es: 'Singapur',       it: 'Singapore' },     country: { en: 'Singapore',    es: 'Singapur',    it: 'Singapore' },      flag: '🇸🇬', coords: { lat: 1.352,  lng: 103.819 } },
  // África
  { name: { en: 'Cairo',          es: 'El Cairo',       it: 'Il Cairo' },      country: { en: 'Egypt',        es: 'Egipto',      it: 'Egitto' },         flag: '🇪🇬', coords: { lat: 30.044, lng: 31.236 }  },
  { name: { en: 'Cape Town',      es: 'Ciudad del Cabo',it: 'Città del Capo' },country: { en: 'South Africa', es: 'Sudáfrica',   it: 'Sudafrica' },      flag: '🇿🇦', coords: { lat: -33.925, lng: 18.424 } },
  // Oceanía
  { name: { en: 'Sydney',         es: 'Sídney',         it: 'Sydney' },        country: { en: 'Australia',    es: 'Australia',   it: 'Australia' },      flag: '🇦🇺', coords: { lat: -33.868, lng: 151.209 }},
];

const ALL_MEDIA_V2 = LOCATIONS_V2.flatMap(l => l.media);
const YEARS_V2 = [...new Set(LOCATIONS_V2.map(l => l.year))].sort((a,b)=>b-a);

// ─── STATS — single source of truth ─────────────────────────────────────
// Atlas StatsBand y Story StorySection LEEN de aquí. No hardcodear en JSX.
// `countries` = unique countries from LOCATIONS_V2 (real filmed material).
// `places` = total unique locations with material.
// `flights` ≈ hours × 2 (batería DJI Mini 4 Pro ~30 min).
const STATS_V2 = (() => {
  const countrySet = new Set();
  LOCATIONS_V2.forEach(loc => {
    const c = typeof loc.country === 'object' ? loc.country.en : loc.country;
    countrySet.add(c);
  });
  const countries = countrySet.size; // 6 real countries, not 44
  const places = LOCATIONS_V2.length;
  const hours_flown = 640;
  const flights = hours_flown * 2; // 1 batería = ~30 min
  const projects = 24;
  return { countries, places, hours_flown, flights, projects };
})();

// FAQ
const FAQ_V2 = [
  {
    q: { en: 'What is your typical turnaround?', es: '¿Cuál es el tiempo de entrega típico?', it: 'Qual è il tempo di consegna tipico?' },
    a: { en: 'Drafts within 5 working days, finals in 10–14 depending on scope.', es: 'Avances en 5 días hábiles, finales entre 10 y 14 según el alcance.', it: 'Bozze entro 5 giorni lavorativi, finali in 10–14 a seconda della portata.' },
  },
  {
    q: { en: 'What do I receive at delivery?', es: '¿Qué recibo en la entrega?', it: 'Cosa ricevo alla consegna?' },
    a: { en: 'Color-graded master, 1080p web cuts, vertical 9:16, and originals on request.', es: 'Master con color, cortes 1080p para web, verticales 9:16 y originales bajo pedido.', it: 'Master con color, tagli 1080p per il web, verticali 9:16 e originali su richiesta.' },
  },
  {
    q: { en: 'Do you travel for shoots?', es: '¿Viajás para los rodajes?', it: 'Viaggi per le riprese?' },
    a: { en: 'Yes — based in Mar del Plata, available worldwide. Travel quoted separately.', es: 'Sí — base en Mar del Plata, disponible mundialmente. Viajes se cotizan aparte.', it: 'Sì — base a Mar del Plata, disponibile ovunque. Viaggi quotati a parte.' },
  },
  {
    q: { en: 'How does licensing work?', es: '¿Cómo funciona la licencia?', it: 'Come funziona la licenza?' },
    a: { en: 'Standard usage included. Broadcast, paid media, and exclusivity quoted on top.', es: 'Uso estándar incluido. Broadcast, medios pagos y exclusividad se cotizan aparte.', it: 'Uso standard incluso. Broadcast, media a pagamento ed esclusività quotati a parte.' },
  },
  {
    q: { en: 'Are you certified to fly drones?', es: '¿Estás certificado para volar drones?', it: 'Sei certificato per volare con i droni?' },
    a: { en: 'Yes. ANAC-certified in Argentina. EU A1/A3 compliant. Insured equipment.', es: 'Sí. Certificación ANAC Argentina. Cumple EU A1/A3. Equipo asegurado.', it: 'Sì. Certificato ANAC Argentina. Conforme EU A1/A3. Attrezzatura assicurata.' },
  },
  {
    q: { en: 'What gear do you fly?', es: '¿Con qué equipo volás?', it: 'Che attrezzatura usi?' },
    a: { en: 'DJI Mini 4 Pro for travel, Air 3 for higher payloads. Ray-Ban Meta for POV.', es: 'DJI Mini 4 Pro para viaje, Air 3 para carga útil. Ray-Ban Meta para POV.', it: 'DJI Mini 4 Pro per i viaggi, Air 3 per carichi maggiori. Ray-Ban Meta per il POV.' },
  },
  {
    q: { en: 'Can you work to a creative brief?', es: '¿Trabajás con un brief creativo?', it: 'Lavori su brief creativo?' },
    a: { en: 'Yes — bring storyboards, shot lists, mood references. I deliver to brief or co-create from scratch.', es: 'Sí — trae storyboards, shot lists, referencias. Entrego según brief o co-creo desde cero.', it: 'Sì — porta storyboard, shot list, riferimenti. Consegno su brief o co-creo da zero.' },
  },
  {
    q: { en: 'Deposit and payment terms?', es: '¿Anticipo y términos de pago?', it: 'Anticipo e termini di pagamento?' },
    a: { en: '50% to lock dates, 50% on delivery. USD or EUR via wire or Wise.', es: '50% para fijar fechas, 50% al entregar. USD o EUR por transferencia o Wise.', it: '50% per fissare le date, 50% alla consegna. USD o EUR tramite bonifico o Wise.' },
  },
];

// Process steps
const PROCESS_V2 = [
  {
    n: '01',
    title: { en: 'Brief', es: 'Brief', it: 'Brief' },
    body: { en: 'A 30-min call. Goals, locations, audiences. We define the success picture together.', es: 'Una llamada de 30 min. Objetivos, ubicaciones, audiencias. Definimos juntos cómo se ve el éxito.', it: 'Una chiamata di 30 min. Obiettivi, location, audience. Definiamo insieme il quadro del successo.' },
  },
  {
    n: '02',
    title: { en: 'Plan', es: 'Plan', it: 'Piano' },
    body: { en: 'Shot list, weather windows, permits, gear. Every flight scouted before takeoff.', es: 'Shot list, ventanas de clima, permisos, equipo. Cada vuelo se scoutea antes del despegue.', it: 'Shot list, finestre meteo, permessi, attrezzatura. Ogni volo viene esplorato prima del decollo.' },
  },
  {
    n: '03',
    title: { en: 'Capture', es: 'Captura', it: 'Cattura' },
    body: { en: 'On location with redundant batteries, ND filters, Ray-Ban Meta for the in-between moments.', es: 'En ubicación con baterías redundantes, filtros ND, Ray-Ban Meta para los momentos intermedios.', it: 'In location con batterie ridondanti, filtri ND, Ray-Ban Meta per i momenti intermedi.' },
  },
  {
    n: '04',
    title: { en: 'Deliver', es: 'Entrega', it: 'Consegna' },
    body: { en: 'Color-graded edit, vertical cuts, masters and source files. Two revision rounds included.', es: 'Edit con color, cortes verticales, masters y fuentes. Dos rondas de revisión incluidas.', it: 'Edit con color, tagli verticali, master e file sorgente. Due round di revisione inclusi.' },
  },
];

// Testimonials — voces cercanas que reflejan el por qué del trabajo
const TESTIMONIALS_V2 = [
  {
    quote: {
      en: 'I\'ll probably never make it to Sardinia, but watching your video felt like I was floating over it. Thank you for taking me there.',
      es: 'Seguro nunca voy a poder ir a Cerdeña, pero mirar tu video fue como flotar arriba de la isla. Gracias por llevarme.',
      it: 'Probabilmente non riuscirò mai ad andare in Sardegna, ma guardare il tuo video è stato come fluttuare sopra l\'isola. Grazie per portarmici.',
    },
    name: 'Lucía F.',
    role: { en: 'Friend · Buenos Aires', es: 'Amiga · Buenos Aires', it: 'Amica · Buenos Aires' },
  },
  {
    quote: {
      en: 'Every time you post, I save it. It\'s the closest thing I have to traveling. Don\'t stop showing what you see.',
      es: 'Cada vez que subís algo lo guardo. Es lo más cerca que estoy de viajar. No dejes nunca de mostrar lo que ves.',
      it: 'Ogni volta che pubblichi qualcosa la salvo. È la cosa più vicina al viaggiare che ho. Non smettere mai di mostrare ciò che vedi.',
    },
    name: 'Diego M.',
    role: { en: 'Cousin · Córdoba', es: 'Primo · Córdoba', it: 'Cugino · Córdoba' },
  },
  {
    quote: {
      en: 'Your photos aren\'t postcards — they\'re a way of looking. You feel the place before you see it.',
      es: 'Tus fotos no son postales — son una forma de mirar. Se siente el lugar antes de verlo.',
      it: 'Le tue foto non sono cartoline — sono un modo di guardare. Si sente il luogo prima di vederlo.',
    },
    name: 'Florencia S.',
    role: { en: 'Friend · Mar del Plata', es: 'Amiga · Mar del Plata', it: 'Amica · Mar del Plata' },
  },
];

const PRESS_V2 = [
  { name: 'DJI Pilot Showcase', year: 2024 },
  { name: 'Italian Tourism Board', year: 2024 },
  { name: 'Patagonia Travel Co.', year: 2023 },
  { name: 'Marrakech Films', year: 2023 },
  { name: 'Ray-Ban Meta Creators', year: 2025 },
];

// Profile carousel — author portraits at different locations.
// Files live in media/optimized/Fotos_Emilio_Perfil/ as .webp (already optimized).
// Paths are URL-encoding safe (underscores, not spaces). Do not rename without
// updating ranuk-manifest.js too.
const PROFILE_PHOTOS = [
  '/media/optimized/Fotos_Emilio_Perfil/img-0232.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-0565.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-2072.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-2868.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-3224.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-3831.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-3983.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-4080.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-5441.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-7204.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-8589.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-8895.webp',
  '/media/optimized/Fotos_Emilio_Perfil/img-9396.webp',
  '/media/optimized/Fotos_Emilio_Perfil/7c9ab927-bed6-451d-9052-2435effcf914.webp',
];

Object.assign(window, {
  LOCATIONS_V2,
  VISITED_DOTS_V2,
  ALL_MEDIA_V2,
  YEARS_V2,
  STATS_V2,
  FAQ_V2,
  PROCESS_V2,
  TESTIMONIALS_V2,
  PRESS_V2,
  HERO_SEQUENCE,
  PROFILE_PHOTOS,
});
