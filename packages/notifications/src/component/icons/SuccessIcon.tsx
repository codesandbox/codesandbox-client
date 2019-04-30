import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function SuccessIcon({ style }: Props) {
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
        d="M8.81336 15.8534L4.66669 11.7067L3.25336 13.1201L8.81336 18.6667L19.5 7.5L18.0867 6.1L8.81336 15.8534Z"
        fill="currentColor"
      />
    </svg>
  );
}
