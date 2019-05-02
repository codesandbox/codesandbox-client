import * as React from 'react';

export default ({ width = 32, height = 32, className }) => (
  <svg className={className} height={height} viewBox="0 0 36 33" width={width}>
    <g fill="none" fillRule="evenodd" transform="translate(0 .5)">
      <path
        d="M20 2.236L5.618 31h28.764L20 2.236z"
        stroke="#fff"
        strokeWidth="2"
      />
      <path d="M12 2l12 24H0" fill="#fff" />
    </g>
  </svg>
);
