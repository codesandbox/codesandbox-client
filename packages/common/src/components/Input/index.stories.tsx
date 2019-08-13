import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Input from './';

const stories = storiesOf('components/Input', module);

stories
  .add('Basic Input', () => <Input />)
  .add('Error Input', () => <Input error />)
  .add('Placeholder Input', () => <Input placeholder="Hello" />);
