import React from 'react';
import { Helmet } from 'react-helmet';
import { useAppState } from 'app/overmind';
import { Element, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import {
  Route,
  BrowserRouter,
  Switch as RouterSwitch,
  useLocation,
} from 'react-router-dom';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';
import { SettingNavigation } from '../components/Navigation';
import { PermissionSettings } from '../components/PermissionSettings';
import { WorkspaceSettings } from './WorkspaceSettings';
import { RegistrySettings } from './RegistrySettings';

export const TeamSettings = () => {
  const { user: stateUser, activeTeam, activeTeamInfo: team } = useAppState();
  const location = useLocation();

  if (!team || !stateUser) {
    return <Header title="Team Settings" activeTeam={null} />;
  }

  return (
    <>
      <Helmet>
        <title>Team Settings - CodeSandbox</title>
      </Helmet>
      <Header title="Team Settings" activeTeam={activeTeam} />
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
          paddingY: 10,
        })}
      >
        <Stack
          direction="vertical"
          gap={8}
          css={css({
            marginX: 'auto',
            width: `calc(100% - ${2 * GUTTER}px)`,
            maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
          })}
        >
          <SettingNavigation isPersonal={false} teamId={activeTeam} />
          <BrowserRouter>
            <RouterSwitch location={location}>
              <Route
                component={RegistrySettings}
                path={dashboardUrls.registrySettings()}
              />
              <Route
                component={PermissionSettings}
                path={dashboardUrls.permissionSettings()}
              />
              <Route
                component={WorkspaceSettings}
                path={dashboardUrls.settings()}
              />
            </RouterSwitch>
          </BrowserRouter>
        </Stack>
      </Element>
    </>
  );
};
