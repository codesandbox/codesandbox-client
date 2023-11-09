import React, { useEffect } from 'react';

import { useActions, useAppState } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Header } from '../../../Components/Header';
import { TeamSettings } from './TeamSettings';

import { GRID_MAX_WIDTH } from '../../../Components/VariableGrid/constants';
import { UserSettings } from './UserSettings';

export const Settings = () => {
  const { activeTeam, user, activeTeamInfo } = useAppState();
  const { isLegacyPersonalPro } = useWorkspaceSubscription();

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

  return (
    <Element css={css({ width: '100%', maxWidth: GRID_MAX_WIDTH })} marginY={7}>
      {isLegacyPersonalPro ? <UserSettings /> : <TeamSettings />}
    </Element>
  );
};
