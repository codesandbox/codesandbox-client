import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function ErrorIcon(props: Props) {
  return (
    <svg width="29" height="29" fill="none" viewBox="0 0 29 29" {...props}>
      <path
        fill="#FF453A"
        fillRule="evenodd"
        d="M14.142 6.142a8 8 0 016.32 12.906L9.236 7.822a7.965 7.965 0 014.906-1.68zm-6.32 3.095l11.226 11.225A8 8 0 017.822 9.237zm6.32-5.095c5.523 0 10 4.477 10 10s-4.477 10-10 10-10-4.477-10-10 4.477-10 10-10z"
        clipRule="evenodd"
      />
    </svg>
  );
}
