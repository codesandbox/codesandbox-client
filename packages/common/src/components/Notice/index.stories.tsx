import React from 'react';
import { storiesOf } from '@storybook/react';
import Notice from './';

const stories = storiesOf('components/Notice', module);

stories.add('Notice', () => <Notice>You need to Login</Notice>);
