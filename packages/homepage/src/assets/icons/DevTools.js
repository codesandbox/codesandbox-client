import React from 'react';

const DevTools = props => (
  <svg width={32} height={32} fill="none" viewBox="0 0 32 32" {...props}>
    <rect
      width={32}
      height={32}
      fill={props.active ? '#fff' : '#242424'}
      rx={4}
    />
    <path
      fill="#757575"
      fillRule="evenodd"
      d="M11.2 8A3.2 3.2 0 008 11.2v9.6a3.2 3.2 0 003.2 3.2h9.6a3.2 3.2 0 003.2-3.2v-5.847L17.685 20.8l-8.108-7.508 2.056-2.014 6.052 5.603 6.311-5.843A3.2 3.2 0 0020.8 8h-9.6z"
      clipRule="evenodd"
    />
    <path
      fill="#757575"
      fillRule="evenodd"
      d="M10 8a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-7.047l5.333-4.939L27.277 8 24 11.034V10a2 2 0 00-2-2H10zm14 3.034l-6.315 5.847-6.052-5.603-2.056 2.014 8.108 7.508L24 14.953v-3.919z"
      clipRule="evenodd"
    />
  </svg>
);

export default DevTools;
