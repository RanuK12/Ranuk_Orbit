import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background:
            'radial-gradient(ellipse at 20% 15%, rgba(30,111,164,0.30) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 82% 88%, rgba(201,162,39,0.22) 0%, transparent 60%), ' +
            '#0A0A0A',
          color: '#F7F7F5',
          padding: 80,
          fontFamily: 'serif',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 28, letterSpacing: '0.04em' }}>
          <span style={{ fontSize: 44 }}>⊕</span>
          Ranuk Orbit
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: 22,
              letterSpacing: '0.45em',
              textTransform: 'uppercase',
              color: 'rgba(247,247,245,0.6)',
              marginBottom: 24,
            }}
          >
            Drone · POV · Travel
          </span>
          <div style={{ fontSize: 110, lineHeight: 1, letterSpacing: '-0.01em', display: 'flex', flexDirection: 'column' }}>
            <span>Earth, from</span>
            <span>
              <span style={{ fontStyle: 'italic', color: '#C9A227' }}>another</span>
              <span> angle</span>
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, color: 'rgba(247,247,245,0.5)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
          <span>Emilio Ranucoli</span>
          <span>ranukorbit.com</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
