import React from 'react';
import deepmerge from 'deepmerge';
import * as icons from './icons';

export const Icon = ({ size = 32, color = 'inherit', css = {}, ...props }) => {
  const SVG = icons[props.name];

  return (
    <SVG
      width={size}
      height={size}
      css={deepmerge({ color }, css)}
      {...props}
    />
  );
};
