import React from 'react';

export const SyncedIcon = props => (
  <svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}>
    <path
      fill="#0971F1"
      fillRule="evenodd"
      d="M11.35 13.202l4.84-4.741 1.038 1.075-5.877 5.758-4.091-4.008 1.037-1.075 3.054 2.991z"
      clipRule="evenodd"
    />
  </svg>
);

export const OutOfSyncIcon = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fill="#0971F1"
        fillRule="evenodd"
        d="M7.994 3.892c-1.896 0-3.471 1.47-3.782 3.401h-.844C3.686 4.867 5.636 3 7.994 3c1.7 0 3.187.97 4.005 2.42V3.713H13V7.28H9.997V6.21h1.454c-.62-1.372-1.935-2.318-3.457-2.318zM8.006 13c2.354 0 4.3-1.86 4.625-4.28h-.845c-.316 1.925-1.888 3.388-3.78 3.388-1.522 0-2.836-.946-3.457-2.318h1.455V8.72H3v3.567h1.001V10.58C4.82 12.03 6.306 13 8.006 13z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0H16V16H0z" />
      </clipPath>
    </defs>
  </svg>
);
