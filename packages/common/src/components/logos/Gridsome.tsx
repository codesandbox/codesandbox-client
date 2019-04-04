import * as React from 'react';

export default ({ width = 32, height = 32, className }) => (
  <svg
    width={width}
    height={height}
    className={className}
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient 
        id="gridsome_paint0_linear" 
        x1="124" 
        y1="-37" 
        x2="-15.3949" 
        y2="446.346" 
        gradientUnits="userSpaceOnUse">
        <stop 
          stop-color="#00A672"
        />
        <stop 
          offset="1" 
          stop-color="#008B60"
        />
      </linearGradient>
      
      <linearGradient 
        id="gridsome_paint1_linear"
        x1="263.861" 
        y1="445.388"
        x2="263.861"
        y2="251.498"
        gradientUnits="userSpaceOnUse">
        <stop 
          stop-color="white" 
          stop-opacity="0.95"
        />
        <stop 
          offset="1"
          stop-color="white"
          stop-opacity="0.5"
        />
      </linearGradient>
    </defs>

    <rect 
      width="512"
      height="512"
      rx="256" 
      fill="url(#gridsome_paint0_linear)"
    />
    
    <path 
      d="M320.368 257.735C320.368 240.765 334.25 227.008 351.375 227.008H396.563C413.688 227.008 428 240.765 428 257.735C428 274.705 413.688 288.462 396.563 288.462H351.375C334.25 288.462 320.368 274.705 320.368 257.735Z"
      fill="white"
    />
    
    <path 
      d="M225.554 257.78C225.554 240.785 239.348 227.008 256.345 227.008C273.342 227.008 287.137 240.785 287.137 257.78C287.137 274.775 273.342 288.552 256.345 288.552C239.348 288.552 225.554 274.775 225.554 257.78Z"
      fill="white"
    />
    
    <path 
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M286.284 114.008C286.971 130.569 274.102 144.552 257.538 145.24C186.036 148.209 142.385 204.243 144.51 257.449C145.171 274.011 132.548 287.974 115.983 288.635C99.4189 289.296 84.8521 275.93 84.1907 259.367C80.7283 172.664 153.133 86.95 255.047 85.2667C271.611 84.5789 285.596 97.4468 286.284 114.008Z"
      fill="white"
    />
    
    <path 
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M84.0967 256.154C84.5034 360.913 170.483 430.138 257.415 427.999C360.033 424.337 434.165 335.203 428 255.637C426.57 239.112 411.913 226.303 395.354 227.097C378.795 227.892 366.016 241.957 366.81 258.513C369.13 306.869 324.536 366.092 255.938 367.993C201.449 369.333 146.897 326.551 144.508 259.968C143.87 275.404 131.701 288.008 115.983 288.635C99.4185 289.296 84.8518 275.93 84.1904 259.367C84.1476 258.296 84.1164 257.225 84.0967 256.154Z"
      fill="url(#gridsome_paint1_linear)"
    />

  </svg>
);
