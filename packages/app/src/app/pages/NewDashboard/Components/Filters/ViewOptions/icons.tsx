import React from 'react';

export const GridIcon = props => (
  <svg width={15} height={14} fill="none" viewBox="0 0 15 14" {...props}>
    <path
      fill={props.active ? '#fff' : '#757575'}
      fillRule="evenodd"
      d="M6.709 0H.65v6H6.71V0zm0 8H.65v6H6.71V8zm2.02 0h6.057v6H8.728V8zm6.057-8H8.728v6h6.058V0z"
      clipRule="evenodd"
    />
  </svg>
);

export const ListIcon = props => (
  <svg width={15} height={15} fill="none" viewBox="0 0 10 10" {...props}>
    <path
      fill={props.active ? '#fff' : '#757575'}
      fillRule="evenodd"
      d="M2.5 0H0v2.5h2.5V0zm0 3.75H0v2.5h2.5v-2.5zM0 7.5h2.5V10H0V7.5zm10-3.75H3.75v2.5H10v-2.5zM3.75 7.5H10V10H3.75V7.5zM10 0H3.75v2.5H10V0z"
      clipRule="evenodd"
    />
  </svg>
);
