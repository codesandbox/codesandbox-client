import React from 'react';
import { storiesOf } from '@storybook/react';
import AutosizeTextArea from './';

const stories = storiesOf('components/Input', module);
stories.add('Basic AutosizeTextArea', () => (
  <AutosizeTextArea value="I am a fancy textarea" />
));
