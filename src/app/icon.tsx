import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #050B14, #1E3A8A)',
          borderRadius: '128px',
        }}
      >
        <svg
          width="256"
          height="256"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* An 8-point star / Khatam shape */}
          <path
            d="M50 0 L60 30 L90 20 L75 45 L100 65 L70 70 L65 100 L45 75 L15 95 L25 65 L0 45 L30 35 L15 5 Z"
            fill="#D4AF37"
            stroke="#FDE047"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
