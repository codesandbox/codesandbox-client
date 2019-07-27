import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import SandboxCard from './';
import * as fake from './fixtures';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/SandboxCard', module).addDecorator(
  ThemeDecorator
);

stories.add('Basic sandbox card', () => (
  <SandboxCard
    sandbox={fake.sandbox()}
    selectSandbox={action('selectSandbox')}
  />
));
