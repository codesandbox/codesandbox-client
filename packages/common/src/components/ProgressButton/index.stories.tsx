import React from 'react';
import { storiesOf } from '@storybook/react';
import ProgressButton from './';

const stories = storiesOf('components/ProgressButton', module);

stories
  .add('Basic ProgressButton', () => <ProgressButton>Click Me</ProgressButton>)
  .add('ProgressButton disabled', () => (
    <ProgressButton disabled>Click Me</ProgressButton>
  ))
  .add('ProgressButton loading', () => (
    <ProgressButton loading>Click Me</ProgressButton>
  ));
