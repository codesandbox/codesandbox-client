import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function InfoIcon({ style }: Props) {
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
        d="M12 4C7.584 4 4 7.584 4 12C4 16.416 7.584 20 12 20C16.416 20 20 16.416 20 12C20 7.584 16.416 4 12 4ZM13 16.5H11V11.5H13V16.5ZM13 9.5H11V7.5H13V9.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
