import React from 'react';

export default ({ width = 32, height = 32, className }) => (
  <svg
    width={width}
    height={height}
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 259.58 260.47"
    style={{ transform: 'scale(2, 2)' }}
  >
    <defs>
      <clipPath id="a" transform="translate(55 55.1)">
        <path
          fill="none"
          d="M71.61 4.24L15.44 36.67A6.78 6.78 0 0 0 12 42.54v64.89a6.78 6.78 0 0 0 3.39 5.87l56.18 32.45a6.8 6.8 0 0 0 6.79 0l56.17-32.45a6.79 6.79 0 0 0 3.39-5.87V42.54a6.78 6.78 0 0 0-3.4-5.87L78.4 4.24a6.83 6.83 0 0 0-6.8 0"
        />
      </clipPath>
      <linearGradient
        id="b"
        x1="-245.73"
        x2="-244.14"
        y1="504.44"
        y2="504.44"
        gradientTransform="matrix(-50.8 103.5 103.5 50.8 -64583.4 -167)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.3" stopColor="#3e863d" />
        <stop offset="0.5" stopColor="#55934f" />
        <stop offset="0.8" stopColor="#5aad45" />
      </linearGradient>
      <clipPath id="c" transform="translate(55 55.1)">
        <path
          fill="none"
          d="M13.44 111.55a6.8 6.8 0 0 0 2 1.75l48.19 27.83 8 4.61a6.81 6.81 0 0 0 3.91.89 6.94 6.94 0 0 0 1.33-.24l59.27-108.47a6.72 6.72 0 0 0-1.58-1.25L97.78 15.42 78.34 4.24a7.09 7.09 0 0 0-1.76-.71z"
        />
      </clipPath>
      <linearGradient
        id="d"
        x1="-247.4"
        x2="-246.37"
        y1="501.46"
        y2="501.46"
        gradientTransform="rotate(-36.5 113113.8 -110864.6) scale(177.1)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.57" stopColor="#3e863d" />
        <stop offset="0.72" stopColor="#619857" />
        <stop offset="1" stopColor="#76ac64" />
      </linearGradient>
      <clipPath id="e" transform="translate(55 55.1)">
        <path
          fill="none"
          d="M74.33 3.38a6.85 6.85 0 0 0-2.71.87l-56 32.33 60.4 110a6.74 6.74 0 0 0 2.41-.83l56.17-32.45a6.81 6.81 0 0 0 3.28-4.63L76.29 3.49a7.05 7.05 0 0 0-1.37-.14h-.56"
        />
      </clipPath>
      <linearGradient
        id="f"
        x1="-245.84"
        x2="-244.9"
        y1="501.11"
        y2="501.11"
        gradientTransform="matrix(129.9 0 0 -129.9 31948.1 65164.3)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0.16" stopColor="#6bbf47" />
        <stop offset="0.38" stopColor="#79b461" />
        <stop offset="0.47" stopColor="#75ac64" />
        <stop offset="0.7" stopColor="#659e5a" />
        <stop offset="0.9" stopColor="#3e863d" />
      </linearGradient>
    </defs>
    <g clipPath="url(#a)">
      <path
        fill="url(#b)"
        d="M194.72 31.16L36.44-46.42l-81.16 165.56 158.28 77.59z"
        transform="translate(55 55.1)"
      />
    </g>
    <g clipPath="url(#c)">
      <path
        fill="url(#d)"
        d="M-55 54.11L56.76 205.38 204.58 96.17 92.8-55.09z"
        transform="translate(55 55.1)"
      />
    </g>
    <g clipPath="url(#e)">
      <path
        fill="url(#f)"
        d="M15.6 3.35v143.24h122.24V3.35H15.6z"
        transform="translate(55 55.1)"
      />
    </g>
  </svg>
);
