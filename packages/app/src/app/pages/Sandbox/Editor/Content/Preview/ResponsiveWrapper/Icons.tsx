import React from 'react';

export const SwitchIcon = (props: { color: string }) => (
  <svg width={8} height={6} fill="none" viewBox="0 0 8 6" {...props}>
    <path
      fill={props.color}
      d="M8 1.333V2c-.615 0-1.396.75-1.846 1.333h-.616c.14-.4.616-1.333.616-1.333H0v-.68h6.154L5.538 0h.616S7.384 1.333 8 1.333zM0 4.667V4c.615 0 1.396-.75 1.846-1.333h.616C2.322 3.067 1.846 4 1.846 4H8v.68H1.846L2.462 6h-.616S.616 4.667 0 4.667z"
    />
  </svg>
);
export const ArrowDown = (props: { color: string }) => (
  <svg width={7} height={5} fill="none" viewBox="0 0 5 3" {...props}>
    <path
      fill={props.color}
      d="M2.07 2.003L.327.318.07.567l2 1.933 2-1.933-.272-.249L2.07 2.003z"
    />
  </svg>
);

export const CloseIcon = (props: { color: string }) => (
  <svg width={17} height={17} fill="none" viewBox="0 0 17 17" {...props}>
    <path
      fill={props.color}
      d="M16.523 1.735L15.068.281 8.523 6.826 1.977.281.523 1.735l6.545 6.546-6.545 6.545 1.454 1.455 6.546-6.546 6.545 6.546 1.455-1.455-6.546-6.545 6.546-6.546z"
    />
  </svg>
);

export const ResizeIcon = props => (
  <svg width={17} height={17} fill="none" viewBox="0 0 17 17" {...props}>
    <g>
      <path fill="#fff" fillOpacity={0.2} d="M8 8l8-8v13a3 3 0 01-3 3H0l8-8z" />
    </g>
    <g>
      <rect
        width={1}
        height={10}
        x={14.071}
        y={7}
        fill="#000"
        fillOpacity={0.4}
        rx={0.5}
        transform="rotate(45 14.071 7)"
      />
    </g>
    <g>
      <rect
        width={1}
        height={6}
        x={14.243}
        y={10}
        fill="#000"
        fillOpacity={0.4}
        rx={0.5}
        transform="rotate(45 14.243 10)"
      />
    </g>
  </svg>
);
