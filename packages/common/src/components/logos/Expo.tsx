import * as React from 'react';

export default ({
  width = 35,
  height = 35,
  style,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    style={style}
    className={className}
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 205 205"
  >
    <g fill="none" fillRule="evenodd">
      <rect width="205" height="205" fill="#FFF" fillRule="nonzero" rx="48" />
      <g
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        transform="translate(34 22)"
      >
        <polygon
          fill="#FFF"
          stroke="#000020"
          points="41.27 24.18 82.15 .5 93.95 7.14 53.06 30.82"
        />
        <polygon
          fill="#FFF"
          stroke="#00001F"
          points="95.7 160.64 82.03 152.25 44.8 63.19 10.04 110.49 .5 104.89 41.27 24.18 53.06 30.82"
        />
        <polygon
          fill="#000"
          stroke="#000020"
          points="10.04 110.49 53.73 84.57 44.8 63.19"
        />
        <path
          fill="#000"
          stroke="#000020"
          d="M120.67,97.13 C108.294664,97.1335542 97.4483402,88.8530647 94.1901963,76.9143278 C90.9320523,64.9755909 96.0684491,52.333333 106.73,46.05 L94,7.14 L53.06,30.82 L95.7,160.64 L136.59,137 L123.46,97 C122.53277,97.0901207 121.601592,97.133509 120.67,97.13 Z"
        />
        <circle cx="120.51" cy="69.72" r="14.71" fill="#FFF" stroke="#00001F" />
        <path
          fill="#000"
          stroke="#000020"
          d="M133.17,62.22 C131.408731,72.6150654 122.403218,80.2217871 111.86,80.22 C111.28,80.22 110.71,80.22 110.14,80.15 C115.40075,85.3304646 123.686646,85.8086045 129.508373,81.2676574 C135.3301,76.7267103 136.88373,68.5737405 133.14,62.21 L133.17,62.22 Z"
        />
      </g>
    </g>
  </svg>
);
