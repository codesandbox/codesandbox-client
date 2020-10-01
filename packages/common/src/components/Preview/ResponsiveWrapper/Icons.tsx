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
  <svg width={10} height={10} fill="none" viewBox="0 0 8 8" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fill={props.color}
        fillRule="evenodd"
        d="M4 7.07a3 3 0 100-6 3 3 0 000 6zm-.2-5h.4v1.8H6v.4H4.2v1.8h-.4v-1.8H2v-.4h1.8v-1.8z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill={props.color} d="M0 0H8V8H0z" />
      </clipPath>
    </defs>
  </svg>
);

export const DeleteIcon = props => (
  <svg width={10} height={10} fill="none" viewBox="0 0 8 8" {...props}>
    <path
      fill="#F24E62"
      fillRule="evenodd"
      d="M4.099 2.135c1.06 0 1.92.866 1.92 1.935 0 .433-.14.832-.378 1.154L2.953 2.517c.32-.24.717-.382 1.146-.382zm-1.542.78l2.687 2.709c-.32.24-.716.382-1.145.382-1.06 0-1.92-.867-1.92-1.936 0-.432.14-.832.378-1.154zM4.1 1.57a2.49 2.49 0 012.48 2.5c0 1.38-1.11 2.5-2.48 2.5a2.49 2.49 0 01-2.481-2.5c0-1.38 1.11-2.5 2.48-2.5z"
      clipRule="evenodd"
    />
  </svg>
);
