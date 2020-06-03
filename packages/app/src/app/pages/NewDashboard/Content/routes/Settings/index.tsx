import React from 'react';
import { useLocation } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { Element } from '@codesandbox/components';
import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';
import { NewTeam } from './NewTeam';
import { Invite } from './Invite';

export const Settings = () => {
  const { state } = useOvermind();
  const location = useLocation();

  let Component;

  if (location.pathname.includes('settings/new')) Component = NewTeam;
  else if (location.pathname.includes('invite')) Component = Invite;
  else if (state.dashboard.activeTeam) Component = TeamSettings;
  else Component = UserSettings;

  return (
    <Element marginY={10}>
      <Component />
    </Element>
  );
};
