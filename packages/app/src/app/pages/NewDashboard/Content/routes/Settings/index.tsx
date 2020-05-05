import React from 'react';
import { useOvermind } from 'app/overmind';
import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';

export const Settings = () => {
  const { state } = useOvermind();

  if (state.dashboard.activeTeam) {
    return <TeamSettings />;
  }

  return <UserSettings />;
};
