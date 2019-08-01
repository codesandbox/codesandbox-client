import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AutosizeInput from './';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/Input', module).addDecorator(
  ThemeDecorator
);

stories.add('Basic AutosizeInput', () => <AutosizeInput />);
