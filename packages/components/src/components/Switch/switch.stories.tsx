import React from 'react';
import { Switch } from '.';

export default {
  title: 'components/Switch',
  component: Switch,
};

export const Basic = () => <Switch />;

export const defaultOn = () => <Switch defaultOn />;

/* eslint-disable no-console */
export const onChange = () => <Switch onChange={event => console.log(event)} />;
