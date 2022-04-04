import React, { useEffect } from 'react';

import { useActions, useAppState } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

import { Header } from '../../../Components/Header';
import { TeamSettings } from './TeamSettings';
import { UserSettings } from './UserSettings';

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
      <Element css={css({ width: '100%', maxWidth: 1280 })} marginY={10}>
        <Header title="Team Settings" activeTeam={activeTeam} />
      </Element>
    );
  }

  const Component =
    activeTeam === personalWorkspaceId ? UserSettings : TeamSettings;

  return (
    <Element css={css({ width: '100%', maxWidth: 1280 })} marginY={10}>
      <Component />
    </Element>
  );
};
