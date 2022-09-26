import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, BrowserRouter, Switch, useLocation } from 'react-router-dom';
import * as dashboardUrls from '@codesandbox/common/lib/utils/url-generator/dashboard';

import { Header } from '../../../../Components/Header';
import { GRID_MAX_WIDTH, GUTTER } from '../../../../Components/VariableGrid';
import { SettingNavigation } from '../components/Navigation';
import { WorkspaceSettings } from './WorkspaceSettings';
import { PermissionSettings } from '../components/PermissionSettings';

export const UserSettings = () => {
  const { activeTeam, activeTeamInfo } = useAppState();
  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>Settings - CodeSandbox</title>
      </Helmet>
      <Header title="Settings" activeTeam={activeTeam} />
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
          paddingY: 6,
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
          <SettingNavigation personal teamId={activeTeam} />

          {activeTeam === activeTeamInfo.id ? (
            <BrowserRouter>
              <Switch location={location}>
                <Route
                  component={PermissionSettings}
                  path={dashboardUrls.permissionSettings()}
                />
                <Route
                  component={WorkspaceSettings}
                  path={dashboardUrls.settings()}
                />
              </Switch>
            </BrowserRouter>
          ) : (
            <Text css={css({color: 'sideBarSectionHeader.foreground'})} >Loading...</Text>
          )}
        </Stack>
      </Element>
    </>
  );
};
