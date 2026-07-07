import { ImageResponse } from 'next/og';

export const runtime = 'edge';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
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
        }}
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#FAFAF8"
          strokeWidth="1.5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line x1="2" y1="20" x2="22" y2="20" fill="none" />
          <circle cx="12" cy="17" r="3.5" fill="#C9A227" stroke="none" />
          <g fill="#FAFAF8" stroke="none" opacity="0.8">
            <circle cx="7" cy="8" r="0.5" />
            <circle cx="17" cy="6" r="0.75" />
            <circle cx="15" cy="11" r="0.5" />
          </g>
          <path d="M2 8 C 6 5, 10 7, 12 7 C 14 7, 18 5, 22 8" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
