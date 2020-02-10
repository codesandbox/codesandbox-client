import React from 'react';
import { Tags } from '.';

export default {
  title: 'components/Tags',
  component: Tags,
};

export const Basic = () => <Tags tags={['one']} />;

export const ManyTags = () => (
  <Tags tags={['one', 'two', 'three', 'four', 'five']} />
);

export const Removable = () => (
  <Tags
    onRemove={() => {}}
    tags={[
      'one',
      'two',
      'really really long three',
      'four',
      'five',
      'too many tags',
      'might ruin the alignment',
    ]}
  />
);
