import * as React from 'react';

export default ({
  width = 36,
  height = 41,
  className,
  style,
}: {
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}) => (
  <svg
    aria-label="CodeSandbox"
    role="presentation"
    x="0px"
    y="0px"
    className={className}
    width={typeof width === 'number' ? `${width}px` : width}
    height={typeof height === 'number' ? `${height}px` : height}
    style={{ verticalAlign: 'middle', ...style }}
    viewBox="0 0 405 464"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <title>CodeSandbox</title>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M202.013 464V227.265L404.027 113.633V347.211L202.013 464ZM313.493 369.306V296.322L378.775 255.673V160.98L230.422 243.048V416.653L313.493 369.306Z"
      fill="#B8B9BA"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M202.014 464L0 347.211V113.633L198.857 0L404.027 113.633L202.014 227.265V464ZM25.2517 157.823V255.673L98.4314 298.18V372.463L176.762 416.653V243.048L25.2517 157.823ZM268.299 66.2857L198.857 104.59L132.571 66.2857L53.6599 110.476L198.857 195.701L347.211 110.476L268.299 66.2857Z"
      fill="white"
    />
  </svg>
);
