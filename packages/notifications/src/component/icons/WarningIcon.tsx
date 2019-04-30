import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function WarningIcon({ style }: Props) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <path
        d="M3.77297 16.986C2.98869 18.3192 3.95 20 5.49683 20H18.5032C20.05 20 21.0113 18.3192 20.227 16.986L13.7239 5.93058C12.9506 4.61596 11.0494 4.61596 10.2761 5.93058L3.77297 16.986ZM13 18H11V16H13V18ZM13 14H11V9.5H13V14Z"
        fill="currentColor"
      />
    </svg>
  );
}
