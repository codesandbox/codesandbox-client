import React, { ComponentProps, FunctionComponent, SVGAttributes } from 'react';

import { Element } from '../..';

import * as icons from './icons';

type IconProps = SVGAttributes<SVGElement> &
  Omit<ComponentProps<typeof Element>, 'children'> & {
    /** name of the icon */
    name: keyof typeof icons;
    /** title for accessibility */
    title?: string;
    /** Size of the icon, the button is set to 26x26 */
    size?: number;
    /** icon color */
    color?: string;
  };

export const Icon: FunctionComponent<IconProps> = ({
  name = 'notFound',
  size = 4,
  color = 'inherit',
  ...props
}) => {
  const SVG = icons[name];
  // we use a 4px scale for space and size
  const scaledSize = size * 4;

  return (
    <SVG color={color} height={scaledSize} width={scaledSize} {...props} />
  );
};
