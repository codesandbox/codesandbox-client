import React, { FunctionComponent, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

export const EditIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="#757575"
      d="M1.97 14l3.034-.787 7.64-7.64-2.247-2.247-7.64 7.64L1.971 14zM11.52 2.203l-.561.562 2.247 2.247.562-.562a.795.795 0 000-1.124l-1.124-1.123a.794.794 0 00-1.123 0z"
    />
  </svg>
);

export const DeleteIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="#757575"
      d="M13 3.97L12.09 3 8 7.364 3.91 3 3 3.97l4.09 4.363L3 12.697l.91.97L8 9.303l4.09 4.364.91-.97-4.09-4.364L13 3.97z"
    />
  </svg>
);

export const RestartServerIcon: FunctionComponent<IconProps> = props => (
  <svg width={12} height={11} fill="none" viewBox="0 0 12 11" {...props}>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M6.458 9.041a3.875 3.875 0 10-3.832-4.448h1.249L1.937 7.176l-.44-.588-.005.006a4.659 4.659 0 01-.006-.02L0 4.593h1.323a5.167 5.167 0 111.85 4.562l.92-.92a3.858 3.858 0 002.365.806z"
      clipRule="evenodd"
    />
    <path
      fill="#fff"
      d="M8.22 4.934a.23.23 0 01-.012.381L5.85 6.782a.23.23 0 01-.35-.194V3.444a.23.23 0 01.362-.187l2.357 1.677z"
    />
  </svg>
);
