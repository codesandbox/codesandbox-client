import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function ErrorIcon(props: Props) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 23 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.9803 18.7397L4.37303 6.13234C1.703 9.65916 1.97612 14.7041 5.19237 17.9203C8.40863 21.1366 13.4535 21.4097 16.9803 18.7397ZM18.4327 17.3636C21.4258 13.8275 21.255 8.52708 17.9203 5.19239C14.5856 1.8577 9.28514 1.68689 5.74907 4.67996L18.4327 17.3636ZM19.3345 3.77818C23.6303 8.07394 23.6303 15.0388 19.3345 19.3345C15.0387 23.6303 8.07393 23.6303 3.77816 19.3345C-0.517606 15.0388 -0.517606 8.07394 3.77816 3.77818C8.07393 -0.517591 15.0387 -0.517591 19.3345 3.77818Z"
        fill="currentColor"
      />
    </svg>
  );
}
