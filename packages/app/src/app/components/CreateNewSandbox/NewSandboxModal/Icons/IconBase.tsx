import React from 'react';

export interface IIconBaseProps extends React.HTMLAttributes<SVGElement> {
  scale?: number;
  width?: number;
  height?: number;
}

export const IconBase: React.FC<IIconBaseProps> = ({
  scale = 1,
  width = 32,
  height = 32,
  children,
  ...props
}) => (
  <svg
    width={scale * width}
    height={scale * height}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {children}
  </svg>
);
