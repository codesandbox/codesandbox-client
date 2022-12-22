import React, { useEffect } from 'react';

import { useActions, useAppState } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

import { Header } from '../../../Components/Header';
import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';

import { GRID_MAX_WIDTH } from '../../../Components/VariableGrid/constants';

export const Settings = () => {
  const {
    activeTeam,
    user,
    activeTeamInfo,
    personalWorkspaceId,
  } = useAppState();

  const {
    dashboard: { dashboardMounted },
  } = useActions();

  useEffect(() => {
    dashboardMounted();
  }, [dashboardMounted]);

  if (!user || !activeTeamInfo) {
    return (
      <Element css={css({ width: '100%', maxWidth: GRID_MAX_WIDTH })}>
        <Header title="Team Settings" activeTeam={activeTeam} />
      </Element>
    );
  }

  const Component =
    activeTeam === personalWorkspaceId ? UserSettings : TeamSettings;

  return (
    <Element css={css({ width: '100%', maxWidth: GRID_MAX_WIDTH })} marginY={7}>
      <Component />
    </Element>
  );
};
