import React from 'react';
import UpdateFound from '../UpdateFound';
import { Action } from './Action';

export const RefreshButton = () => (
  <Action
    onClick={() => document.location.reload()}
    Icon={UpdateFound}
    tooltip="Update Available! Click to Refresh."
  />
);
