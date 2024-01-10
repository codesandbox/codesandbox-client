import React from 'react';
import { action } from '@storybook/addon-actions';
import { Switch } from '.';

export default {
  title: 'components/Switch',
  component: Switch,
};

export const Basic = () => <Switch />;

export const defaultOn = () => <Switch defaultOn />;

/* eslint-disable no-console */
export const onChange = () => <Switch onChange={action('changed')} />;

export const Disabled = () => (
  <div>
    <Switch disabled defaultOn />
    <Switch disabled />
  </div>
);
