import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Button } from './';

const stories = storiesOf('components/Button', module);

stories.add('Basic button with text', () => (
  <Button onClick={action('onClick')}>Text</Button>
));
