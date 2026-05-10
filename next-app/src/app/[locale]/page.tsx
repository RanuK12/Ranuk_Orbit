import dynamic from 'next/dynamic';
import { unstable_setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Atlas from '@/components/sections/Atlas';

// Code-split heavy sections; they mount only when scrolled into view via
// `loading.tsx`-style skeletons. Keeping hero + atlas eager for first paint.
const Archive = dynamic(() => import('@/components/sections/Archive'), {
  loading: () => <SectionSkeleton />,
});
const Story = dynamic(() => import('@/components/sections/Story'), {
  loading: () => <SectionSkeleton />,
});
const POV = dynamic(() => import('@/components/sections/POV'), {
  loading: () => <SectionSkeleton />,
});
const Services = dynamic(() => import('@/components/sections/Services'), {
  loading: () => <SectionSkeleton />,
});
const Testimonials = dynamic(() => import('@/components/sections/Testimonials'), {
  loading: () => <SectionSkeleton />,
});
const Contact = dynamic(() => import('@/components/sections/Contact'), {
  loading: () => <SectionSkeleton />,
});

function SectionSkeleton() {
  return <div className="section" aria-hidden="true" style={{ minHeight: 400 }} />;
}

export default function HomePage({ params }: { params: { locale: string } }) {
  unstable_setRequestLocale(params.locale);
  return (
    <>
      <Hero />
      <Atlas />
      <Archive />
      <Story />
      <POV />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
