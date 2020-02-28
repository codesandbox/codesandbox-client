import React from 'react';
import { IElementProps } from '../Element';
import * as icons from './icons';

type IconProps = React.SVGAttributes<SVGElement> &
  IElementProps & {
    name: keyof typeof icons;
    size?: number;
    color?: string;
  };

export const Icon: React.FC<IconProps> = ({
  name = 'notFound',
  size = 16,
  color = 'inherit',
  ...props
}) => {
  const SVG = icons[name];

  return <SVG width={size} height={size} color={color} {...props} />;
};
