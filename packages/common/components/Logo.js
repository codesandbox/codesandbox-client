import React from 'react';

export default ({ width = 35, height = 35, className }) => (
  <svg
    x="0px"
    y="0px"
    className={className}
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 1024 1024"
  >
    <g id="Layer_1">
      <polyline
        fill="#FFFFFF"
        points="719.001,851 719.001,639.848 902,533.802 902,745.267 719.001,851"
      />
      <polyline
        fill="#FFFFFF"
        points="302.082,643.438 122.167,539.135 122.167,747.741 302.082,852.573 302.082,643.438"
      />
      <polyline
        fill="#FFFFFF"
        points="511.982,275.795 694.939,169.633 512.06,63 328.436,169.987 511.982,275.795"
      />
    </g>
    <g id="Layer_2">
      <polyline
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="80"
        strokeMiterlimit="10"
        points="899,287.833 509,513 509,963"
      />
      <line
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="80"
        strokeMiterlimit="10"
        x1="122.167"
        y1="289"
        x2="511.5"
        y2="513"
      />
      <polygon
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="80"
        strokeMiterlimit="10"
        points="121,739.083 510.917,963.042 901,738.333 901,288 511,62 121,289"
      />
    </g>
  </svg>
);
