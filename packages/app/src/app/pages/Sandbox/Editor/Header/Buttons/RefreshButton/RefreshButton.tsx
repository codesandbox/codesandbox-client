import React from 'react';
import { Action } from '../Action';
import { UpdateFound } from './UpdateFound';

export const RefreshButton = () => (
  <Action
    onClick={document.location.reload}
    Icon={UpdateFound}
    tooltip="Update Available! Click to Refresh."
  />
);
