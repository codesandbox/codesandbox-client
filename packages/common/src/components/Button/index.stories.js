import React from 'react';
import { text, boolean } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';

import { Button } from './index.tsx';

storiesOf('Button', module)
  .add('Primary', () => (
    <Button onClick={action('clicked')}>{text('Label', 'CodeSandbox')}</Button>
  ))
  .add('Small', () => (
    <Button small={boolean('small', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ))
  .add('Block (Full width)', () => (
    <Button block={boolean('block', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ))
  .add('Secondary', () => (
    <Button secondary={boolean('secondary', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ))
  .add('Disabled', () => (
    <Button disabled={boolean('disabled', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ))
  .add('Danger', () => (
    <Button danger={boolean('danger', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ))
  .add('Red', () => (
    <Button red={boolean('red', true)} onClick={action('clicked')}>
      {text('Label', 'CodeSandbox')}
    </Button>
  ));
