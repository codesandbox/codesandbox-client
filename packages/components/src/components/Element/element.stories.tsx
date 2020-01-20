import React from 'react';
import { LayoutDecorator } from '../../../.storybook/decorators';
import { Element } from '.';

export default {
  title: 'components/Element',
  component: Element,
  decorators: [LayoutDecorator],
};

export const Basic = () => <Element css={{ color: 'pink' }}>content</Element>;

export const AsProp = () => <Element as="span">content</Element>;

export const Margins = () => (
  <>
    <Element margin={2}>2 on the space grid is 2*4px = 8px or 0.5em</Element>
    <Element marginX={2}>left and right</Element>
    <Element marginY={2}>top and bottom</Element>
    <Element marginBottom={2}>prefer margin bottom when you can</Element>
  </>
);
