// Root layout is required but delegates to [locale]/layout.tsx.
// This file exists so Next.js can find a root layout; the actual HTML
// wrapping (lang, fonts, metadata) is produced per-locale downstream.
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
