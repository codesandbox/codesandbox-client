import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { boolean } from '@storybook/addon-knobs';
import Switch from '.';

storiesOf('components/Switch', module)
  .add('Switch', () => <Switch onClick={action('Clikkkk')} right={false} />)
  .add('Switch Right', () => (
    <Switch onClick={action('Clikkkk')} right={boolean('right', true)} />
  ))
  .add('Switch secondary', () => (
    <Switch
      right={false}
      onClick={action('Clikkkk')}
      secondary={boolean('secondary', true)}
    />
  ))
  .add('Switch offMode', () => (
    <Switch
      right={false}
      onClick={action('Clikkkk')}
      offMode={boolean('offMode', true)}
    />
  ))
  .add('Switch small', () => (
    <Switch
      right={false}
      onClick={action('Clikkkk')}
      small={boolean('small', true)}
    />
  ));
