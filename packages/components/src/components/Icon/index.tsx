import React from 'react';
import { IElementProps } from '../Element';
import * as icons from './icons';
import * as iconsNewStyle from './icons-new-style';

export type IconNames = keyof typeof icons | keyof typeof iconsNewStyle;

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
  ...props
}) => {
  const SVG = icons[name] || iconsNewStyle[name];

  return <SVG width={size} height={size} {...props} />;
};
