import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Miqaat - Islamic Daily Companion';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #050B14, #1E3A8A)',
          color: 'white',
          fontFamily: 'sans-serif',
        }}
      >
        <svg
          width="128"
          height="128"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '40px' }}
        >
          <path
            d="M50 0 L60 30 L90 20 L75 45 L100 65 L70 70 L65 100 L45 75 L15 95 L25 65 L0 45 L30 35 L15 5 Z"
            fill="#D4AF37"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <h1 style={{ fontSize: '80px', fontWeight: 'bold', margin: 0, letterSpacing: '-0.02em' }}>
          Miqaat
        </h1>
        <p style={{ fontSize: '32px', color: '#93C5FD', marginTop: '16px' }}>
          Software that moves with the sky.
        </p>
      </div>
    ),
    {
      ...size,
    }
  );
}
