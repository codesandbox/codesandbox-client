import React from 'react';
import { IElementProps } from '../Element';
import * as icons from './icons';

export type IconNames = keyof typeof icons;

type IconProps = React.SVGAttributes<SVGElement> &
  IElementProps & {
    /** name of the icon */
    name: IconNames;
    /** title for accessibility */
    title?: string;
    /** Size of the icon, the button is set to 26x26 */
    size?: number;
    /** icon color */
    color?: string;
  };

export const Icon: React.FC<IconProps> = ({
  name = 'notFound',
  size = 4,
  color = 'inherit',
  ...props
}) => {
  const SVG = icons[name];
  // we use a 4px scale for space and size
  const scaledSize = size * 4;

  return (
    <SVG width={scaledSize} height={scaledSize} color={color} {...props} />
  );
};
