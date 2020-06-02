import React from 'react';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';

export const Settings = () => {
  const { state } = useOvermind();

  let Component;

  if (state.dashboard.activeTeam) Component = TeamSettings;
  else Component = UserSettings;

  return (
    <Element marginY={10}>
      <Component />
    </Element>
  );
};
