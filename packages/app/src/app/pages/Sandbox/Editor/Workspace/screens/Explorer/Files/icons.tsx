import React, { FunctionComponent, SVGProps } from 'react';

export { default as NotSyncedIcon } from 'react-icons/lib/go/primitive-dot';
export { default as DeleteIcon } from 'react-icons/lib/go/trashcan';
export { default as UndoIcon } from 'react-icons/lib/md/undo';

type IconProps = SVGProps<SVGSVGElement>;

export const CrossIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M13 3.903l-.91-.97L8 7.297 3.91 2.933l-.91.97 4.09 4.363L3 12.63l.91.97L8 9.236l4.09 4.364.91-.97-4.09-4.364L13 3.903z"
    />
  </svg>
);

export const EditIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M1.97 14l3.034-.787 7.64-7.64-2.247-2.247-7.64 7.64L1.97 14zM11.52 2.203l-.561.562 2.247 2.247.561-.562a.794.794 0 000-1.124l-1.123-1.123a.794.794 0 00-1.124 0z"
    />
  </svg>
);

export const AddDirectoryIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      d="M6.5 3.5H3a.5.5 0 00-.5.5v8.5a.5.5 0 00.5.5h10a.5.5 0 00.5-.5V5.167a.5.5 0 00-.5-.5H8l-1.167-1.04A.5.5 0 006.5 3.5z"
    />
  </svg>
);

export const AddFileIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M8.284 2.5H4.5A.5.5 0 004 3v10a.5.5 0 00.5.5h7a.5.5 0 00.5-.5V6.08L8.284 2.5zM8 3l3.5 3.5H8V3z"
      clipRule="evenodd"
    />
  </svg>
);

export const DownloadIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7.604 12.293V3h1v9.293L11.5 9.396l.707.708-4.103 4.103L4 10.104l.707-.708 2.897 2.897z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h16v16H0V0z" />
      </clipPath>
    </defs>
  </svg>
);

export const UploadFileIcon: FunctionComponent<IconProps> = props => (
  <svg width={16} height={16} fill="none" viewBox="0 0 16 16" {...props}>
    <g clipPath="url(#clip0)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M8.104 3l4.103 4.104-.707.707-2.896-2.897v9.293h-1V4.914L4.707 7.811 4 7.104 8.104 3z"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="clip0">
        <path fill="currentColor" d="M0 0h16v16H0V0z" />
      </clipPath>
    </defs>
  </svg>
);
