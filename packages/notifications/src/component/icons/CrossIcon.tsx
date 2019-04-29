import * as React from 'react';

export function CrossIcon({
  style,
  onClick,
  className,
}: {
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}) {
  return (
    <svg
      fill="currentColor"
      height="1em"
      width="1em"
      viewBox="0 0 40 40"
      style={{
        verticalAlign: 'middle',
        ...style,
      }}
      onClick={onClick}
      tabIndex={-1}
      className={className}
    >
      <path d="m31.6 10.7l-9.3 9.3 9.3 9.3-2.3 2.3-9.3-9.3-9.3 9.3-2.3-2.3 9.3-9.3-9.3-9.3 2.3-2.3 9.3 9.3 9.3-9.3z" />
    </svg>
  );
}
