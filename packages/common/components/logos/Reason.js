import React from 'react';

export default ({
  width = 35,
  height = 35,
  className,
}: {
  width: number,
  height: number,
  className: ?string,
}) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 218 218"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <rect id="path-1" width="216" height="216" />
      <filter
        x="-.5%"
        y="-.5%"
        width="100.9%"
        height="101.9%"
        filterUnits="objectBoundingBox"
        id="filter-2"
      >
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
        <feComposite
          in="shadowOffsetOuter1"
          in2="SourceAlpha"
          operator="out"
          result="shadowOffsetOuter1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          in="shadowOffsetOuter1"
        />
      </filter>
      <path
        d="M128.128,197 L103.702,197 L91.666,174.108 L75.618,174.108 L75.618,197 L54.024,197 L54.024,114.282 L91.194,114.282 C113.142,114.282 125.65,124.902 125.65,143.31 C125.65,155.818 120.458,165.022 110.9,169.978 L128.128,197 Z M75.618,131.51 L75.618,156.88 L91.312,156.88 C100.044,156.88 105.118,152.396 105.118,144.018 C105.118,135.876 100.044,131.51 91.312,131.51 L75.618,131.51 Z M139.456,114.282 L204.71,114.282 L204.71,131.51 L161.05,131.51 L161.05,146.968 L200.462,146.968 L200.462,164.078 L161.05,164.196 L161.05,179.772 L205.89,179.772 L205.89,197 L139.456,197 L139.456,114.282 Z"
        id="path-3"
      />
      <filter
        x="-.7%"
        y="-1.2%"
        width="101.3%"
        height="102.4%"
        filterUnits="objectBoundingBox"
        id="filter-4"
      >
        <feOffset dy="2" in="SourceAlpha" result="shadowOffsetInner1" />
        <feComposite
          in="shadowOffsetInner1"
          in2="SourceAlpha"
          operator="arithmetic"
          k2="-1"
          k3="1"
          result="shadowInnerInner1"
        />
        <feColorMatrix
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.02 0"
          in="shadowInnerInner1"
        />
      </filter>
    </defs>
    <g id="Page-1" fill="none" fillRule="evenodd">
      <g id="Path">
        <g id="Rectangle-1">
          <use fill="#000" filter="url(#filter-2)" xlinkHref="#path-1" />
          <use fill="#DD4B39" xlinkHref="#path-1" />
          <rect stroke="#D74837" x="0.5" y="0.5" width="215" height="215" />
        </g>
        <g id="[RE]ASON">
          <use fill="#FFF" xlinkHref="#path-3" />
          <use fill="#000" filter="url(#filter-4)" xlinkHref="#path-3" />
        </g>
      </g>
    </g>
  </svg>
);
