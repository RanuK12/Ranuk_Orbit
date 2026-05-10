import type { Locale } from '@/i18n/config';

export type Localized = Partial<Record<Locale, string>> & { en: string };

export type MediaType = 'photo' | 'video' | 'pov';
export type Mood = 'oceanic' | 'golden' | 'cold' | 'warm' | 'green';
export type Altitude = 'aerial' | 'mountain' | 'street' | 'water';

export interface MediaExif {
  camera?: string;
  loc?: string;
}

export interface MediaItem {
  id: string;
  type: MediaType;
  src: string;
  poster?: string;
  title: Localized;
  mood?: Mood;
  altitude?: Altitude;
  year: number;
  exif?: MediaExif;
}

export interface Coords {
  lat: number;
  lng: number;
}

export interface Location {
  id: string;
  name: Localized;
  country: Localized;
  flag: string;
  coords: Coords;
  cover: string;
  accentColor: string;
  year: number;
  description: Localized;
  media: MediaItem[];
}

export interface VisitedDot {
  name: Localized;
  country: Localized;
  flag: string;
  coords: Coords;
}

export interface HeroClip {
  src: string;
  poster: string;
  label: Localized;
}

export interface ServicePackage {
  id: string;
  tag: Localized;
  title: Localized;
  price: string;
  unit: Localized;
  desc: Localized;
  features: Localized[];
  popular?: boolean;
}

export interface FaqItem {
  q: Localized;
  a: Localized;
}

export interface ProcessStep {
  n: string;
  title: Localized;
  body: Localized;
}

export interface Testimonial {
  quote: Localized;
  name: string;
  role: Localized;
}

export interface PressItem {
  name: string;
  year: number;
}

export interface Stats {
  countries: number;
  hours_flown: number;
  flights: number;
  projects: number;
}
