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
const FOTO_DRONE  = (n) => `media/optimized/fotos-drone/${_slug(n)}.jpg`;
const VIDEO_DRONE = (n) => `media/optimized/videos-drone/${_slug(n)}.mp4`;
const FOTO_RB     = (n) => `media/optimized/fotos-rayban/${_slug(n)}.jpg`;
const VIDEO_RB    = (n) => `media/optimized/videos-rayban/${_slug(n)}.mp4`;
const POSTER      = (n) => `media/optimized/posters/${n}`;

const M = (id, type, src, title, mood, altitude, year, exif) => ({
  id, type, src, title, mood, altitude, year, exif: exif || null
});

// Cinematic 3-clip hero sequence — sea → river → snow
const HERO_SEQUENCE = [
  {
    src: VIDEO_DRONE('Cerdeña_Isla-Magdalena_HERO.MP4'),
    poster: POSTER('cerde-na-isla-magdalena-hero.jpg'),
    label: { en: 'Maddalena, Sardinia', es: 'Maddalena, Cerdeña' },
  },
  {
    src: VIDEO_DRONE('Rio_Limay_Patagonia.MP4'),
    poster: POSTER('rio-limay-patagonia.jpg'),
    label: { en: 'Río Limay, Patagonia', es: 'Río Limay, Patagonia' },
  },
  {
    src: VIDEO_DRONE('Atardecer-Nieve-HERO.mov'),
    poster: POSTER('atardecer-nieve-hero.jpg'),
    label: { en: 'Trentino, Italian Alps', es: 'Trentino, Alpes Italianos' },
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
    year: 2024,
    description: {
      en: 'The Maddalena archipelago — turquoise water, granite islands, the Mediterranean at its most cinematic.',
      es: 'El archipiélago de la Maddalena — agua turquesa, islas de granito, el Mediterráneo en su versión más cinematográfica.',
    },
    media: [
      M('cer-1', 'photo', FOTO_DRONE('Cerdeña_Magdalena.JPG'), {en:'Maddalena Dusk',es:'Maddalena al ocaso'}, 'golden', 'aerial', 2024, {camera:'DJI Mini 4 Pro', loc:'La Maddalena, IT'}),
      M('cer-2', 'photo', FOTO_DRONE('Cerdeña-Isla_Magdalena.JPG'), {en:'Maddalena Island',es:'Isla Maddalena'}, 'oceanic', 'aerial', 2024, {camera:'DJI Mini 4 Pro', loc:'La Maddalena, IT'}),
      M('cer-3', 'photo', FOTO_DRONE('Cerdeña_Amigos.JPG'), {en:'Friends, Sardinia',es:'Amigos, Cerdeña'}, 'oceanic', 'aerial', 2024),
      M('cer-4', 'photo', FOTO_RB('Cerdeña-Golfo_Aranci-Isla.jpg'), {en:'Golfo Aranci POV',es:'Golfo Aranci POV'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
      M('cer-5', 'photo', FOTO_RB('Cerdeña_Golfo-Aranci.jpg'), {en:'Golfo Aranci',es:'Golfo Aranci'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
      M('cer-v1', 'video', VIDEO_DRONE('Cerdeña_Velero.MP4'), {en:'Sailboat, Costa Smeralda',es:'Velero, Costa Smeralda'}, 'oceanic', 'aerial', 2024),
      M('cer-v2', 'video', VIDEO_DRONE('Cerdeña_Isla-Magdalena_HERO.MP4'), {en:'Maddalena Aerial',es:'Maddalena aérea'}, 'golden', 'aerial', 2024),
      M('cer-v3', 'video', VIDEO_DRONE('Cerdeña_Golfo-Aranci.MP4'), {en:'Golfo Aranci',es:'Golfo Aranci'}, 'oceanic', 'aerial', 2024),
      M('cer-v4', 'video', VIDEO_DRONE('Cerdeña_Magdalena-isla_Hotel.MP4'), {en:'Hotel, Maddalena',es:'Hotel, Maddalena'}, 'oceanic', 'aerial', 2024),
      M('cer-v5', 'video', VIDEO_DRONE('Cerdeña_Spiaggia_Cala_Sassari.MP4'), {en:'Cala Sassari',es:'Cala Sassari'}, 'oceanic', 'aerial', 2024),
      M('cer-v6', 'video', VIDEO_DRONE('Cerdeña_Spiaggia-Biancha.MP4'), {en:'Spiaggia Bianca',es:'Spiaggia Bianca'}, 'oceanic', 'aerial', 2024),
      M('cer-v7', 'video', VIDEO_DRONE('Cerdeña-Magdalena_Barcos.MP4'), {en:'Boats at Anchor',es:'Barcos fondeados'}, 'oceanic', 'aerial', 2024),
      M('cer-v8', 'video', VIDEO_DRONE('Cerdeña-Spiaggia_Cala_Sabina.MP4'), {en:'Cala Sabina',es:'Cala Sabina'}, 'oceanic', 'aerial', 2024),
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
    year: 2024,
    description: {
      en: 'Trentino, Dolomites — sea of clouds, alpine dusk, snow at golden hour.',
      es: 'Trentino, Dolomitas — mar de nubes, ocaso alpino, nieve en hora dorada.',
    },
    media: [
      M('alp-1', 'photo', FOTO_DRONE('Atardecer_Alpes.JPG'), {en:'Alps at Dusk',es:'Alpes al ocaso'}, 'golden', 'mountain', 2024, {camera:'DJI Mini 4 Pro', loc:'Trentino, IT'}),
      M('alp-2', 'photo', FOTO_DRONE('Atardecer_Alpes_IT.JPG'), {en:'Italian Sunset',es:'Atardecer italiano'}, 'golden', 'mountain', 2024),
      M('alp-3', 'photo', FOTO_DRONE('Alpes_Dolomitas.JPG'), {en:'The Dolomites',es:'Las Dolomitas'}, 'cold', 'mountain', 2024),
      M('alp-4', 'photo', FOTO_DRONE('Atardecer_Arriba-del-Cielo.JPG'), {en:'Above the Clouds',es:'Sobre las nubes'}, 'golden', 'aerial', 2024),
      M('alp-v1', 'video', VIDEO_DRONE('Atardecer-Nieve-HERO.mov'), {en:'Snow at Golden Hour',es:'Nieve en hora dorada'}, 'golden', 'mountain', 2024),
      M('alp-v2', 'video', VIDEO_DRONE('Alpes_Italianos_Atardecer.mov'), {en:'Alps Sunset',es:'Atardecer Alpes'}, 'golden', 'mountain', 2024),
      M('alp-v3', 'video', VIDEO_DRONE('Alpes_Italianos.mov'), {en:'Italian Alps',es:'Alpes italianos'}, 'cold', 'mountain', 2024),
      M('alp-v4', 'video', VIDEO_DRONE('Alpes_Italianos_trentino.MP4'), {en:'Trentino',es:'Trentino'}, 'cold', 'mountain', 2024),
      M('alp-v5', 'video', VIDEO_DRONE('Alpes_Italianos_Dolomitas-Perro.MP4'), {en:'Dog in the Dolomites',es:'Perro en las Dolomitas'}, 'cold', 'mountain', 2024),
      M('alp-v6', 'video', VIDEO_DRONE('Atardecer-Nieve_Alpes-Italianos-Trentino.MP4'), {en:'Trentino Snow',es:'Nieve en Trentino'}, 'golden', 'mountain', 2024),
      M('alp-v7', 'video', VIDEO_DRONE('Alpes_Italianos_Dolomitas-9:16.mov'), {en:'Dolomites Vertical',es:'Dolomitas vertical'}, 'cold', 'mountain', 2024),
      M('alp-v8', 'pov', VIDEO_RB('Paseo-Perro_Alpes_IT.MOV'), {en:'Walking the Dog, Alps',es:'Paseo con el perro'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('alp-v9', 'pov', VIDEO_RB('Ski-Alpes_Italia.mov'), {en:'Skiing the Alps',es:'Esquiando los Alpes'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'The Forum, the Colosseum — eternal stone, walking the bones of the empire.',
      es: 'El Foro, el Coliseo — piedra eterna, caminando los huesos del imperio.',
    },
    media: [
      M('rom-v1', 'pov', VIDEO_RB('Coliseo-Roma.mov'), {en:'Colosseum',es:'Coliseo'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta', loc:'Roma, IT'}),
      M('rom-v2', 'pov', VIDEO_RB('Foro-Romano_Roma.mov'), {en:'Roman Forum',es:'Foro Romano'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Hilltop villages, Vesuvius on the horizon, monasteries cut into rock.',
      es: 'Pueblos en colinas, el Vesubio en el horizonte, monasterios tallados en roca.',
    },
    media: [
      M('cal-1', 'photo', FOTO_DRONE('Pueblito-Calabria.JPG'), {en:'Calabrian Village',es:'Pueblito calabrés'}, 'warm', 'mountain', 2024),
      M('cal-v1', 'video', VIDEO_DRONE('Atardecer_Calabria-Vesubio-al-fondo.MP4'), {en:'Vesuvius Backdrop',es:'Vesubio al fondo'}, 'golden', 'aerial', 2024),
      M('cal-v2', 'video', VIDEO_DRONE('Monasterio-Calabria-Epic_Italy.MP4'), {en:'Monastery',es:'Monasterio'}, 'warm', 'aerial', 2024),
      M('cal-v3', 'video', VIDEO_DRONE('Castillo-Calabria_9:16.mov'), {en:'Castle, Vertical',es:'Castillo vertical'}, 'warm', 'aerial', 2024),
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
    year: 2024,
    description: {
      en: 'Bariloche, Neuquén — the Limay river, enchanted valleys, Patagonian forests.',
      es: 'Bariloche, Neuquén — el río Limay, valles encantados, bosques patagónicos.',
    },
    media: [
      M('pat-1', 'photo', FOTO_DRONE('Valle_Encantado-Patagonia.JPG'), {en:'Enchanted Valley',es:'Valle Encantado'}, 'cold', 'mountain', 2024, {camera:'DJI Mini 4 Pro', loc:'Valle Encantado, AR'}),
      M('pat-2', 'photo', FOTO_DRONE('Rio_Limay-Patagonia.JPG'), {en:'Limay River',es:'Río Limay'}, 'cold', 'aerial', 2024),
      M('pat-v1', 'video', VIDEO_DRONE('Bosque_Patagonia-Argentina.MP4'), {en:'Patagonian Forest',es:'Bosque patagónico'}, 'cold', 'aerial', 2024),
      M('pat-v2', 'video', VIDEO_DRONE('Rio_Limay_Patagonia.MP4'), {en:'Río Limay',es:'Río Limay'}, 'cold', 'aerial', 2024),
      M('pat-v3', 'video', VIDEO_DRONE('Valle_Encantado_rio-Limay.MP4'), {en:'Enchanted Valley',es:'Valle Encantado'}, 'cold', 'aerial', 2024),
      M('pat-v4', 'video', VIDEO_DRONE('Valle_Encantado-Rio_Limay.MP4'), {en:'Limay Valley',es:'Valle del Limay'}, 'cold', 'aerial', 2024),
      M('pat-v5', 'video', VIDEO_DRONE('Villa-Pehuenia_Neuquen.MP4'), {en:'Villa Pehuenia',es:'Villa Pehuenia'}, 'cold', 'mountain', 2024),
      M('pat-v6', 'video', VIDEO_DRONE('Villa_Pehuenia-Patagonia-9:16.mov'), {en:'Pehuenia Vertical',es:'Pehuenia vertical'}, 'cold', 'mountain', 2024),
      M('pat-v7', 'pov', VIDEO_RB('Bariloche_Mirador-Circuito-Chico.MOV'), {en:'Circuito Chico Vista',es:'Mirador Circuito Chico'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('pat-v8', 'pov', VIDEO_RB('Kayak-Bariloche.mp4'), {en:'Kayak, Bariloche',es:'Kayak en Bariloche'}, 'oceanic', 'water', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Cerro de los 7 Colores, Salinas Grandes, El Hornocal — high desert, layered rock, salt flats.',
      es: 'Cerro de los 7 Colores, Salinas Grandes, El Hornocal — alta puna, roca estratificada, salares.',
    },
    media: [
      M('juj-1', 'photo', FOTO_RB('Salinas_Grandes-Jujuy.jpg'), {en:'Salinas Grandes',es:'Salinas Grandes'}, 'warm', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('juj-v1', 'video', VIDEO_DRONE('Cerro_7colores.mov'), {en:'Cerro de los 7 Colores',es:'Cerro de los 7 Colores'}, 'warm', 'mountain', 2024),
      M('juj-v2', 'video', VIDEO_DRONE('Cerro7Colores_Jujuy.mov'), {en:'7 Colores',es:'7 Colores'}, 'warm', 'mountain', 2024),
      M('juj-v3', 'video', VIDEO_DRONE('El_Hornacal.MP4'), {en:'El Hornocal',es:'El Hornocal'}, 'warm', 'aerial', 2024),
      M('juj-v4', 'video', VIDEO_DRONE('El_Hornacal-9:16.mov'), {en:'El Hornocal Vertical',es:'El Hornocal vertical'}, 'warm', 'aerial', 2024),
      M('juj-v5', 'video', VIDEO_DRONE('Paseo-de-los-Angeles_Jujuy.mov'), {en:'Paseo de los Ángeles',es:'Paseo de los Ángeles'}, 'warm', 'aerial', 2024),
      M('juj-v6', 'video', VIDEO_DRONE('Pumamarca_Jujuy.mov'), {en:'Purmamarca',es:'Purmamarca'}, 'warm', 'mountain', 2024),
      M('juj-v7', 'video', VIDEO_DRONE('Ruta-de-la-Cornisa_Salta-Jujuy.mov'), {en:'Cornisa Route',es:'Ruta de la Cornisa'}, 'green', 'mountain', 2024),
      M('juj-v8', 'pov', VIDEO_RB('Jujuy_Montaña.mp4'), {en:'Jujuy Mountain',es:'Montaña, Jujuy'}, 'warm', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
      M('juj-v9', 'pov', VIDEO_RB('Jujuy_Tilcara-Compra-Tortilla.MOV'), {en:'Tortilla Stand, Tilcara',es:'Tortilla en Tilcara'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Sierras, lakes, the open countryside — Carlos Paz, James Craik, Los Gigantes.',
      es: 'Sierras, lagos, el campo abierto — Carlos Paz, James Craik, Los Gigantes.',
    },
    media: [
      M('cor-1', 'photo', FOTO_DRONE('Carlos-Paz_Cba.JPG'), {en:'Carlos Paz',es:'Carlos Paz'}, 'warm', 'aerial', 2024),
      M('cor-2', 'photo', FOTO_RB('James_Craik-Cordoba.jpeg'), {en:'James Craik, Córdoba',es:'James Craik, Córdoba'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('cor-3', 'photo', FOTO_RB('Los_Andes-Avion.jpeg'), {en:'Andes from Above',es:'Andes desde el aire'}, 'cold', 'aerial', 2024, {camera:'Ray-Ban Meta'}),
      M('cor-v1', 'video', VIDEO_DRONE('Carlos_Paz-Cordoba.MP4'), {en:'Carlos Paz',es:'Carlos Paz'}, 'warm', 'aerial', 2024),
      M('cor-v2', 'video', VIDEO_DRONE('Laguna_"La-Chanchera"_Cordoba.mov'), {en:'La Chanchera Lagoon',es:'Laguna La Chanchera'}, 'cold', 'aerial', 2024),
      M('cor-v3', 'video', VIDEO_DRONE('James-Craik_Tren-9:16.mov'), {en:'Train, James Craik',es:'Tren, James Craik'}, 'warm', 'aerial', 2024),
      M('cor-v4', 'pov', VIDEO_RB('Campo_James-Craik_Cordoba.mov'), {en:'James Craik Fields',es:'Campo James Craik'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('cor-v5', 'pov', VIDEO_RB('Sierras-Cba_Los-Gigantes.mov'), {en:'Los Gigantes',es:'Los Gigantes'}, 'cold', 'mountain', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Home. The Atlantic, the open horizon — where every flight starts.',
      es: 'Casa. El Atlántico, el horizonte abierto — donde empieza cada vuelo.',
    },
    media: [
      M('mdp-v1', 'video', VIDEO_DRONE('Mar_Del_Plata.mov'), {en:'Mar del Plata',es:'Mar del Plata'}, 'cold', 'aerial', 2024),
    ]
  },
  {
    id: 'lasleñas',
    name: { en: 'Las Leñas', es: 'Las Leñas', it: 'Las Leñas' },
    country: { en: 'Argentina', es: 'Argentina', it: 'Argentina' },
    flag: '🇦🇷',
    coords: { lat: -35.155, lng: -70.085 },
    cover: FOTO_DRONE('Atardecer_Alpes.JPG'),
    accentColor: '#8FA8C0',
    year: 2024,
    description: {
      en: 'High Andes, Mendoza — vertical drop, blue shadows on white.',
      es: 'Alta cordillera, Mendoza — caída vertical, sombras azules sobre el blanco.',
    },
    media: [
      M('lln-v1', 'video', VIDEO_DRONE('Las_Leñas-9:16.mov'), {en:'Las Leñas Vertical',es:'Las Leñas vertical'}, 'cold', 'mountain', 2024),
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
    year: 2023,
    description: {
      en: 'Aghroud, Taghazout, Marrakech — Atlantic surf coast, dyers in the medina, motorcycle south.',
      es: 'Aghroud, Taghazout, Marrakech — costa de surf atlántica, tintoreros en la medina, moto al sur.',
    },
    media: [
      M('mar-1', 'photo', FOTO_DRONE('Aghroud_Marruecos.JPG'), {en:'Aghroud Coast',es:'Costa de Aghroud'}, 'warm', 'aerial', 2023),
      M('mar-2', 'photo', FOTO_DRONE('Agrhoud-Marruecos.JPG'), {en:'Aghroud Sands',es:'Arenas de Aghroud'}, 'warm', 'aerial', 2023),
      M('mar-3', 'photo', FOTO_RB('Marruecos-Tintes_Marrakech.jpg'), {en:'Dyers, Marrakech',es:'Tintoreros, Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-4', 'photo', FOTO_RB('Taghazout-Marruecos.jpg'), {en:'Taghazout',es:'Taghazout'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v1', 'video', VIDEO_DRONE('Aghroud_Marruecos.MP4'), {en:'Aghroud',es:'Aghroud'}, 'warm', 'aerial', 2023),
      M('mar-v2', 'video', VIDEO_DRONE('Aghroud-panoramica.MP4'), {en:'Aghroud Panoramic',es:'Aghroud panorámica'}, 'warm', 'aerial', 2023),
      M('mar-v3', 'video', VIDEO_DRONE('Taghazout_Marruecos.MP4'), {en:'Taghazout Surf',es:'Taghazout surf'}, 'oceanic', 'aerial', 2023),
      M('mar-v4', 'pov', VIDEO_RB('Agadir_Marruecos-Moto.MOV'), {en:'Agadir on Motorcycle',es:'Agadir en moto'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v5', 'pov', VIDEO_RB('Marrakech_Centro-Callecitas.mov'), {en:'Marrakech Alleys',es:'Callecitas Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v6', 'pov', VIDEO_RB('Marrakech_Centro.MOV'), {en:'Marrakech Center',es:'Centro Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v7', 'pov', VIDEO_RB('Marrakech-Paseo-Centro.mov'), {en:'Marrakech Walk',es:'Paseo Marrakech'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
      M('mar-v8', 'pov', VIDEO_RB('Viaje-Moto_Sur_Marruecos.MOV'), {en:'South Morocco Ride',es:'Sur de Marruecos en moto'}, 'warm', 'street', 2023, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Canals, bicycles, Zaandam, the Rijksmuseum — Dutch light and quiet repetition.',
      es: 'Canales, bicicletas, Zaandam, el Rijksmuseum — luz holandesa y repetición tranquila.',
    },
    media: [
      M('ams-v1', 'video', VIDEO_DRONE('Amsterdam.mov'), {en:'Amsterdam',es:'Ámsterdam'}, 'cold', 'aerial', 2024),
      M('ams-v2', 'video', VIDEO_DRONE('Amsterdam_Parque-Zaandam.MP4'), {en:'Zaandam Park',es:'Parque Zaandam'}, 'green', 'aerial', 2024),
      M('ams-v3', 'video', VIDEO_DRONE('Zaanse Schans_Amsterdam.MP4'), {en:'Zaanse Schans',es:'Zaanse Schans'}, 'cold', 'aerial', 2024),
      M('ams-v4', 'pov', VIDEO_RB('Amsterdam_Centro-Bici.mov'), {en:'Bike Through Center',es:'Centro en bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v5', 'pov', VIDEO_RB('Amsterdam-Centro.mov'), {en:'Center Walk',es:'Paseo centro'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v6', 'pov', VIDEO_RB('Albert-Cuyp-Market_Amsterdam.mov'), {en:'Albert Cuyp Market',es:'Mercado Albert Cuyp'}, 'warm', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v7', 'pov', VIDEO_RB('Palacio-Real_Amsterdam.mov'), {en:'Royal Palace',es:'Palacio Real'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v8', 'pov', VIDEO_RB('Paseo-Amsterdam-Centro.mov'), {en:'Center Walk',es:'Paseo centro'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v9', 'pov', VIDEO_RB('Rijksmuseum_Amsterdam.mov'), {en:'Rijksmuseum',es:'Rijksmuseum'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v10', 'pov', VIDEO_RB('Torre-de-la-Moneda_Amsterdam-Paseo.mov'), {en:'Mint Tower',es:'Torre de la Moneda'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v11', 'pov', VIDEO_RB('Zaandam-Centro.mov'), {en:'Zaandam',es:'Zaandam'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('ams-v12', 'pov', VIDEO_RB('Zaandam-Paseo.mov'), {en:'Zaandam Walk',es:'Paseo Zaandam'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
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
    year: 2024,
    description: {
      en: 'Marienplatz at dusk, bikes through the old town, Bavarian sunsets.',
      es: 'Marienplatz al ocaso, bicis por el casco histórico, atardeceres bávaros.',
    },
    media: [
      M('mun-1', 'photo', FOTO_RB('Marienplatz-Munich.jpg'), {en:'Marienplatz',es:'Marienplatz'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v1', 'video', VIDEO_DRONE('Munich_Atardecer.MP4'), {en:'Munich Sunset',es:'Atardecer Múnich'}, 'golden', 'aerial', 2024),
      M('mun-v2', 'pov', VIDEO_RB('Marienplatz-Munich.MOV'), {en:'Marienplatz POV',es:'Marienplatz POV'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v3', 'pov', VIDEO_RB('Munich_Bici-Paseo.MOV'), {en:'Munich Bike Ride',es:'Múnich en bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v4', 'pov', VIDEO_RB('Munich-Giro-Bici.MOV'), {en:'Munich by Bike',es:'Vuelta en bici'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
      M('mun-v5', 'pov', VIDEO_RB('Paseo_Munich.mov'), {en:'Munich Walk',es:'Paseo Múnich'}, 'cold', 'street', 2024, {camera:'Ray-Ban Meta'}),
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
    },
    media: [
      M('tha-1', 'photo', FOTO_RB('Bangkok-Thai.jpeg'), {en:'Bangkok',es:'Bangkok'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-2', 'photo', FOTO_RB('Templo_Wat-Phra-Kaew-Thai.jpeg'), {en:'Wat Phra Kaew',es:'Wat Phra Kaew'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v1', 'pov', VIDEO_RB('7-Eleven_Thailandia-Chiang_Mai.mov'), {en:'7-Eleven, Chiang Mai',es:'7-Eleven Chiang Mai'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v2', 'pov', VIDEO_RB('Bangkok_Viaje-Moto.mov'), {en:'Bangkok by Motorcycle',es:'Bangkok en moto'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v3', 'pov', VIDEO_RB('Elefantes-Thailandia.mov'), {en:'Elephants',es:'Elefantes'}, 'green', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v4', 'pov', VIDEO_RB('Infierno-Cielo_Templo-Blanco-Thai.mov'), {en:'White Temple, Inner View',es:'Templo Blanco, vista interior'}, 'cold', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v5', 'pov', VIDEO_RB('Ko-Yao-Noi_Campos-Arroz-Thai.mp4'), {en:'Rice Fields, Ko Yao Noi',es:'Arrozales, Ko Yao Noi'}, 'green', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v6', 'pov', VIDEO_RB('Panwa-Beach_Phuket_Thai.mov'), {en:'Panwa Beach, Phuket',es:'Playa Panwa, Phuket'}, 'oceanic', 'water', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v7', 'pov', VIDEO_RB('Templo_Buda-Acostado_Thai.mov'), {en:'Reclining Buddha',es:'Buda Reclinado'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v8', 'pov', VIDEO_RB('Templo_Wat-Pho_Thai.mov'), {en:'Wat Pho',es:'Wat Pho'}, 'warm', 'street', 2025, {camera:'Ray-Ban Meta'}),
      M('tha-v9', 'pov', VIDEO_RB('Templo-Blanco_Thailandia.mov'), {en:'White Temple',es:'Templo Blanco'}, 'cold', 'street', 2025, {camera:'Ray-Ban Meta'}),
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

LOCATIONS_V2.forEach(loc => {
  loc.media.forEach(m => { m.location = { id: loc.id, name: loc.name, flag: loc.flag, year: loc.year }; });
});

const ALL_MEDIA_V2 = LOCATIONS_V2.flatMap(l => l.media);
const YEARS_V2 = [...new Set(LOCATIONS_V2.map(l => l.year))].sort((a,b)=>b-a);

// Stats for Story counters
const STATS_V2 = {
  countries: 6,
  hours_flown: 280,
  projects: 24,
};

// FAQ
const FAQ_V2 = [
  {
    q: { en: 'What is your typical turnaround?', es: '¿Cuál es el tiempo de entrega típico?' },
    a: { en: 'Drafts within 5 working days, finals in 10–14 depending on scope.', es: 'Avances en 5 días hábiles, finales entre 10 y 14 según el alcance.' },
  },
  {
    q: { en: 'What do I receive at delivery?', es: '¿Qué recibo en la entrega?' },
    a: { en: 'Color-graded master, 1080p web cuts, vertical 9:16, and originals on request.', es: 'Master con color, cortes 1080p para web, verticales 9:16 y originales bajo pedido.' },
  },
  {
    q: { en: 'Do you travel for shoots?', es: '¿Viajás para los rodajes?' },
    a: { en: 'Yes — based in Mar del Plata, available worldwide. Travel quoted separately.', es: 'Sí — base en Mar del Plata, disponible mundialmente. Viajes se cotizan aparte.' },
  },
  {
    q: { en: 'How does licensing work?', es: '¿Cómo funciona la licencia?' },
    a: { en: 'Standard usage included. Broadcast, paid media, and exclusivity quoted on top.', es: 'Uso estándar incluido. Broadcast, medios pagos y exclusividad se cotizan aparte.' },
  },
  {
    q: { en: 'Are you certified to fly drones?', es: '¿Estás certificado para volar drones?' },
    a: { en: 'Yes. ANAC-certified in Argentina. EU A1/A3 compliant. Insured equipment.', es: 'Sí. Certificación ANAC Argentina. Cumple EU A1/A3. Equipo asegurado.' },
  },
  {
    q: { en: 'What gear do you fly?', es: '¿Con qué equipo volás?' },
    a: { en: 'DJI Mini 4 Pro for travel, Air 3 for higher payloads. Ray-Ban Meta for POV.', es: 'DJI Mini 4 Pro para viaje, Air 3 para carga útil. Ray-Ban Meta para POV.' },
  },
  {
    q: { en: 'Can you work to a creative brief?', es: '¿Trabajás con un brief creativo?' },
    a: { en: 'Yes — bring storyboards, shot lists, mood references. I deliver to brief or co-create from scratch.', es: 'Sí — trae storyboards, shot lists, referencias. Entrego según brief o co-creo desde cero.' },
  },
  {
    q: { en: 'Deposit and payment terms?', es: '¿Anticipo y términos de pago?' },
    a: { en: '50% to lock dates, 50% on delivery. USD or EUR via wire or Wise.', es: '50% para fijar fechas, 50% al entregar. USD o EUR por transferencia o Wise.' },
  },
];

// Process steps
const PROCESS_V2 = [
  {
    n: '01',
    title: { en: 'Brief', es: 'Brief' },
    body: { en: 'A 30-min call. Goals, locations, audiences. We define the success picture together.', es: 'Una llamada de 30 min. Objetivos, ubicaciones, audiencias. Definimos juntos cómo se ve el éxito.' },
  },
  {
    n: '02',
    title: { en: 'Plan', es: 'Plan' },
    body: { en: 'Shot list, weather windows, permits, gear. Every flight scouted before takeoff.', es: 'Shot list, ventanas de clima, permisos, equipo. Cada vuelo se scoutea antes del despegue.' },
  },
  {
    n: '03',
    title: { en: 'Capture', es: 'Captura' },
    body: { en: 'On location with redundant batteries, ND filters, Ray-Ban Meta for the in-between moments.', es: 'En ubicación con baterías redundantes, filtros ND, Ray-Ban Meta para los momentos intermedios.' },
  },
  {
    n: '04',
    title: { en: 'Deliver', es: 'Entrega' },
    body: { en: 'Color-graded edit, vertical cuts, masters and source files. Two revision rounds included.', es: 'Edit con color, cortes verticales, masters y fuentes. Dos rondas de revisión incluidas.' },
  },
];

// Testimonials (placeholders to be replaced when client quotes arrive)
const TESTIMONIALS_V2 = [
  {
    quote: {
      en: 'Emilio captured what we couldn\'t describe. The footage doesn\'t document the place — it speaks for it.',
      es: 'Emilio capturó lo que no podíamos describir. El material no documenta el lugar — habla por él.',
    },
    name: 'María L.',
    role: { en: 'Creative Director, Tourism Board', es: 'Directora Creativa, Ente de Turismo' },
  },
  {
    quote: {
      en: 'A rare combination — a drone pilot who thinks like a director and edits like an essayist.',
      es: 'Una combinación rara — un piloto de drone que piensa como director y edita como ensayista.',
    },
    name: 'Tomás R.',
    role: { en: 'Producer, Independent Film', es: 'Productor, Cine Independiente' },
  },
  {
    quote: {
      en: 'Delivered in five days what our previous team couldn\'t in six weeks. And it was beautiful.',
      es: 'Entregó en cinco días lo que el equipo anterior no pudo en seis semanas. Y fue hermoso.',
    },
    name: 'Sofía B.',
    role: { en: 'Founder, Hospitality Brand', es: 'Fundadora, Marca de Hospitalidad' },
  },
];

const PRESS_V2 = [
  { name: 'DJI Pilot Showcase', year: 2024 },
  { name: 'Italian Tourism Board', year: 2024 },
  { name: 'Patagonia Travel Co.', year: 2023 },
  { name: 'Marrakech Films', year: 2023 },
  { name: 'Ray-Ban Meta Creators', year: 2025 },
];

Object.assign(window, {
  LOCATIONS_V2,
  ALL_MEDIA_V2,
  YEARS_V2,
  STATS_V2,
  FAQ_V2,
  PROCESS_V2,
  TESTIMONIALS_V2,
  PRESS_V2,
  HERO_SEQUENCE,
});
