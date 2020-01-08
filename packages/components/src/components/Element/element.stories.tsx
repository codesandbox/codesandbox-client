import React from 'react';
import { LayoutDecorator } from '../../../.storybook/decorators';
import { Element } from '.';

export default {
  title: 'components/Element',
  component: Element,
  decorators: [LayoutDecorator],
};

// replace the text inside with Text variants when available
export const Basic = () => (
  <Element>
    <div />
  </Element>
);

export const DefaultOpen = () => (
  <Element>
    <div />
  </Element>
);
