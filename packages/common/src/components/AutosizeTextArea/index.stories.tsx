import * as React from 'react';
import { storiesOf } from '@storybook/react';
import AutosizeTextArea from './';
import { ThemeDecorator } from '../../stories/decorators';

const stories = storiesOf('components/Input', module).addDecorator(
  ThemeDecorator
);

stories.add('Basic AutosizeTextArea', () => <AutosizeTextArea />);
