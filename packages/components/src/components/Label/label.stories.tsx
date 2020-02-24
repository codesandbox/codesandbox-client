import React from 'react';
import { Label } from '.';

export default {
  title: 'components/Label',
  component: Label,
};

export const Basic = () => (
  <Label htmlFor="input-element">Plan old boring text</Label>
);

export const Block = () => (
  <Label block marginX={2}>
    Sometimes you need your label to be a block
  </Label>
);
