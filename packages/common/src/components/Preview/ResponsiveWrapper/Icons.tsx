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

export const AddIcon = (props: { color: string }) => (
  <svg width={8} height={9} fill="none" viewBox="0 0 6 7" {...props}>
    <path
      fill={props.color}
      fillRule="evenodd"
      d="M3 6.07a3 3 0 100-6 3 3 0 000 6zm-.2-5h.4v1.8H5v.4H3.2v1.8h-.4v-1.8H1v-.4h1.8v-1.8z"
      clipRule="evenodd"
    />
  </svg>
);

export const DeleteIcon = props => (
  <svg width={8} height={8} fill="none" viewBox="0 0 6 6" {...props}>
    <path
      fill="#F24E62"
      fillRule="evenodd"
      d="M3.099 1.072A1.99 1.99 0 015.082 3.07a2 2 0 01-.416 1.224L1.884 1.491a1.965 1.965 0 011.215-.419zm-1.567.774l2.782 2.803a1.965 1.965 0 01-1.215.42A1.99 1.99 0 011.116 3.07a2 2 0 01.416-1.224zM3.099.57a2.49 2.49 0 012.48 2.5c0 1.38-1.11 2.5-2.48 2.5a2.49 2.49 0 01-2.481-2.5c0-1.38 1.11-2.5 2.48-2.5z"
      clipRule="evenodd"
    />
  </svg>
);
