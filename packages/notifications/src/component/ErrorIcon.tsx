import * as React from 'react';

export function ErrorIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg
      fill="currentColor"
      height="1em"
      width="1em"
      viewBox="0 0 40 40"
      style={{ verticalAlign: 'middle', ...style }}
    >
      <path d="m19.8 3.8c8.9 0 16.2 7.3 16.2 16.2s-7.3 16.3-16.2 16.3-16.3-7.4-16.3-16.3 7.3-16.2 16.3-16.2z m1.8 24.3v-3.1h-3.7v3.1h3.7z m0-6.8v-10h-3.7v10h3.7z" />
    </svg>
  );
}
