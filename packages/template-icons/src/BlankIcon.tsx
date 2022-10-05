import React from 'react';
import { SVGIcon, ISVGIconProps } from './SVGIcon';

export const BlankIcon: React.FC<ISVGIconProps> = ({ ...props }) => (
  <SVGIcon {...props}>
    <path
      clipRule="evenodd"
      d="m200 400h200v-200h-200zm179.545-20.455v-159.09h-159.09v159.09z"
      fill="#f5f5f7"
      fillRule="evenodd"
    />
  </SVGIcon>
);
