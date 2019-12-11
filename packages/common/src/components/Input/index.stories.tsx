import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from '.';

const stories = storiesOf('components/Input', module);

stories
  .add('Basic Input', () => <Input value="I am a fancy input" />)
  .add('Error Input', () => <Input value="I am a fancy input" error />)
  .add('Placeholder Input', () => <Input placeholder="Hello" />);
