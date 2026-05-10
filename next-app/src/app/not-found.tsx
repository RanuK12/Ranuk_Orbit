import Link from 'next/link';

export const dynamic = 'force-static';

export default function NotFound() {
  return (
    <html lang="en">
      <body style={{
        background: '#0A0A0A',
        color: '#F7F7F5',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'serif',
        textAlign: 'center',
        padding: '40px 24px',
      }}>
        <span style={{ fontSize: 48, marginBottom: 24 }}>⊕</span>
        <h1 style={{ fontSize: 48, margin: 0, letterSpacing: '-0.01em' }}>Not found.</h1>
        <p style={{ opacity: 0.7, marginTop: 16 }}>The place you&apos;re looking for drifted out of orbit.</p>
        <Link href="/en" style={{
          marginTop: 32,
          padding: '12px 24px',
          border: '1px solid rgba(247,247,245,0.3)',
          borderRadius: 999,
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          fontSize: 11,
        }}>Return home</Link>
      </body>
    </html>
  );
}
