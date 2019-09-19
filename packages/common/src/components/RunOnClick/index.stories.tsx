import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import RunOnClick from '.';

const stories = storiesOf('components/RunOnClick', module);

stories.add('Basic RunOnClick', () => <RunOnClick onClick={action('click')} />);
