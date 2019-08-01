import * as React from 'react';
import { storiesOf } from '@storybook/react';
import Input from './';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/Input', module).addDecorator(
  ThemeDecorator
);

stories.add('Basic Input', () => <Input />);
stories.add('Block Input', () => <Input input />);
stories.add('Error Input', () => <Input error />);
stories.add('Placeholder Input', () => <Input placeholder="Hello" />);
