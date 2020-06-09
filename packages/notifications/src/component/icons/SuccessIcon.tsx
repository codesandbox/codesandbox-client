import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function SuccessIcon(props: Props) {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 22 22" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11zm6-15l-6.503 6.322-4.103-3.989L5 10.767l5.497 5.345 7.897-7.678L17 7z"
        clipRule="evenodd"
      />
    </svg>
  );
}
