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
