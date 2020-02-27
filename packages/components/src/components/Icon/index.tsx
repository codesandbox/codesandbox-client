import React from 'react';
import * as icons from './icons';

export const Icon = ({ size = 16, color = 'inherit', ...props }) => {
  const SVG = icons[props.name] || icons.notFound;

  return <SVG width={size} height={size} color={color} {...props} />;
};
