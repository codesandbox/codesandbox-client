import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function ErrorIcon({ style }: Props) {
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
        d="M19.3733 6.04004L17.96 4.62671L12 10.5867L6.03998 4.62671L4.62665 6.04004L10.5866 12L4.62665 17.96L6.03998 19.3734L12 13.4134L17.96 19.3734L19.3733 17.96L13.4133 12L19.3733 6.04004Z"
        fill="currentColor"
      />
    </svg>
  );
}
