import React from 'react';

export default ({
  width = 35,
  height = 35,
  className,
  style,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    aria-label="CodeSandbox"
    role="presentation"
    x="0px"
    y="0px"
    className={className}
    width={typeof width === 'number' ? `${width}px` : width}
    height={typeof height === 'number' ? `${height}px` : height}
    viewBox="0 0 452 452"
    style={{ verticalAlign: 'middle', ...style }}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0 452h452V0H0v452zm405.773-46.227V46.227H46.227v359.546h359.546z"
      fill="#ffffff"
    />
  </svg>
);
