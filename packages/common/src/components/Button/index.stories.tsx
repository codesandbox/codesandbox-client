import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { text, boolean } from '@storybook/addon-knobs';
import { Button } from '.';

storiesOf('components/Button', module)
  .add('Basic button with text', () => (
    <Button onClick={action('onClick')}>{text('Value', 'Text')}</Button>
  ))
  .add('Button small', () => (
    <Button small={boolean('small', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ))
  .add('Button block', () => (
    <Button block={boolean('block', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ))
  .add('Button disabled', () => (
    <Button disabled={boolean('disabled', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ))
  .add('Button red', () => (
    <Button red={boolean('red', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ))
  .add('Button secondary', () => (
    <Button secondary={boolean('secondary', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ))
  .add('Button danger', () => (
    <Button danger={boolean('danger', true)} onClick={action('onClick')}>
      {text('Value', 'Text')}
    </Button>
  ));
