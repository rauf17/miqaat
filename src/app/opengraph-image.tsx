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
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FAFAF8"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginBottom: '40px' }}
        >
          {/* MKT-026: removed dead fill="none" on <line> (stroked shape) */}
          <line x1="2" y1="20" x2="22" y2="20" />
          <circle cx="12" cy="17" r="3.5" fill="#C9A227" stroke="none" />
          <path d="M2 8 C 6 5, 10 7, 12 7 C 14 7, 18 5, 22 8" fill="none" strokeLinecap="round" />
          {/* MKT-020: added star decoration to match icon + apple-icon */}
          <g fill="#FAFAF8" stroke="none" opacity="0.8">
            <circle cx="7" cy="8" r="0.5" />
            <circle cx="17" cy="6" r="0.75" />
            <circle cx="15" cy="11" r="0.5" />
          </g>
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
