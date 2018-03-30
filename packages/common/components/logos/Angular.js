import React from 'react';

export default ({ width = 35, height = 35, className }) => (
  <svg
    className={className}
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 250 250"
  >
    <polygon
      className="st0"
      fill="#DD0031"
      points="125,30 125,30 125,30 31.9,63.2 46.1,186.3 125,230 125,230 125,230 203.9,186.3 218.1,63.2 	"
    />
    <polygon
      className="st1"
      fill="#C3002F"
      points="125,30 125,52.2 125,52.1 125,153.4 125,153.4 125,230 125,230 203.9,186.3 218.1,63.2 125,30 	"
    />
    <path
      className="st2"
      fill="#FFFFFF"
      d="M125 52.1L66.8 182.6h21.7l11.7-29.2h49.4l11.7 29.2H183L125 52.1zm17 83.3h-34l17-40.9 17 40.9z"
    />
  </svg>
);
