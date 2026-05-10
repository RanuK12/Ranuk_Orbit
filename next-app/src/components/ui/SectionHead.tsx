import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeadProps {
  overline: string;
  title: ReactNode;
  sub?: string;
  className?: string;
  align?: 'left' | 'center';
}

export default function SectionHead({ overline, title, sub, className, align = 'left' }: SectionHeadProps) {
  return (
    <header className={cn('section-head', align === 'center' && 'mx-auto text-center', className)}>
      <span className="text-overline block mb-4">{overline}</span>
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
    </header>
  );
}
