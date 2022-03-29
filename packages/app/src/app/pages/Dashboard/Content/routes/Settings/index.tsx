import React, { useEffect } from 'react';

import { useActions, useAppState, useEffects } from 'app/overmind';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useLocation, useHistory } from 'react-router-dom';

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
  const { notificationToast } = useEffects();
  const {
    dashboard: { dashboardMounted },
  } = useActions();
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    dashboardMounted();
  }, [dashboardMounted]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);

    if (activeTeamInfo?.name && personalWorkspaceId) {
      const isPersonalTeam = activeTeam === personalWorkspaceId;

      if (queryParams.has('success_upgrade')) {
        const successMessage = isPersonalTeam
          ? 'Your personal team was successfully upgraded to Personal Pro'
          : `<strong>${activeTeamInfo.name}</strong> was successfully upgraded to Team Pro`;

        notificationToast.success(successMessage);
        queryParams.delete('success_upgrade');
      } else if (queryParams.has('error_upgrade')) {
        notificationToast.error(
          'Something went wrong in the subscription proccess. Try again later.'
        );
        queryParams.delete('error_upgrade');
      }

      history.replace({ search: queryParams.toString() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTeamInfo, activeTeam, personalWorkspaceId]);

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
