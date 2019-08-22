import React from 'react';
import { storiesOf } from '@storybook/react';
import RunOnClick from './';
import { action } from '@storybook/addon-actions';

const stories = storiesOf('components/RunOnClick', module);

stories.add('Basic RunOnClick', () => <RunOnClick onClick={action('click')} />);
