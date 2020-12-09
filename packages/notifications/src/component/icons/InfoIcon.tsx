import * as React from 'react';

type Props = {
  style?: React.CSSProperties;
};

export function InfoIcon(props: Props) {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 22 22" {...props}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11zm1.675-14.616H8v1.808h2.444V14.2H8V16h7v-1.8h-2.325V7.384zM10.373 4.71c-.058.143-.087.3-.087.47 0 .17.029.329.087.477.064.144.15.268.262.375.111.1.243.18.397.238.159.059.333.088.524.088.391 0 .7-.109.928-.326.233-.223.35-.507.35-.853 0-.345-.117-.626-.35-.844-.227-.223-.537-.334-.928-.334-.19 0-.365.03-.524.088-.154.058-.286.14-.397.246a1.06 1.06 0 00-.262.375z"
        clipRule="evenodd"
      />
    </svg>
  );
}
