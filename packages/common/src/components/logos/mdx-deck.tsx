import * as React from 'react';

export default ({ width = 32, height = 32, className }) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 128 128"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g fill="none" fillRule="evenodd">
      <rect
        stroke="#EAEAEA"
        strokeWidth="1.5"
        fill="#FFF"
        x=".75"
        y=".75"
        width="136.5"
        height="55.5"
        rx="4.5"
      />
      <g stroke="#000" strokeWidth={6}>
        <path d="M70.5 36V13.836" strokeLinecap="square" />
        <path d="M57 27.24l13.61 13.61 13.416-13.414" />
      </g>
      <path
        stroke="#000"
        strokeWidth={6}
        d="M16.45 43.928V18.964L30.3 32.815l13.932-13.931v24.865"
      />
      <path
        d="M122.439 41.268L93.17 12m.391 29.268L122.83 12"
        stroke="#F9AC00"
        strokeWidth={6}
      />
    </g>
  </svg>
);
