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
  <Tags removeTag={() => {}} tags={['one', 'two', 'three', 'four', 'five']} />
);
