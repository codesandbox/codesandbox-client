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
  };

export const Icon: React.FC<IconProps> = ({
  name = 'notFound',
  size = 16,
  css = {},
  ...props
}) => {
  const SVG = icons[name];

  return (
    <SVG
      width={size}
      height={size}
      css={{ flexShrink: 0, ...css }}
      aria-hidden
      {...props}
    />
  );
};
