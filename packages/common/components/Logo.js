import React from 'react';
import Logo from './Logo.png';

export default ({
  width = 35,
  height = 35,
  className,
}: {
  width: number,
  height: number,
  className: ?string,
}) => (
  <img
    className={className}
    src={Logo}
    width={width}
    height={height}
    alt="Logo"
  />
);
