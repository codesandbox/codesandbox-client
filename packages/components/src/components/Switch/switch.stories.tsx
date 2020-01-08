import { action } from '@storybook/addon-actions';
import React from 'react';

import { Switch } from '.';

export default {
  title: 'components/Switch',
  component: Switch,
};

export const Basic = () => <Switch />;

export const defaultOn = () => <Switch defaultOn />;

export const onChange = () => <Switch onChange={action('changed')} />;
