import { Element, Stack, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState } from 'app/overmind';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Route, BrowserRouter, Switch, useLocation } from 'react-router-dom';

import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { Header } from '../../../../Components/Header';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from '../../../../Components/VariableGrid/constants';
import { WorkspaceSettings } from './WorkspaceSettings';
import { PermissionSettings } from '../components/PermissionSettings';
import { SettingsNavigation } from '../components/Navigation';

export const UserSettings = () => {
  const { activeTeam, activeTeamInfo } = useAppState();
  const location = useLocation();

  const { isPro } = useWorkspaceSubscription();

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
          {isPro && <SettingsNavigation isPersonal teamId={activeTeam} />}

          {activeTeam === activeTeamInfo.id ? (
            <BrowserRouter>
              <Switch location={location}>
                <Route
                  component={PermissionSettings}
                  path="/dashboard/settings/permissions"
                />
                <Route
                  component={WorkspaceSettings}
                  path="/dashboard/settings"
                />
              </Switch>
            </BrowserRouter>
          ) : (
            <Text css={css({ color: 'sideBarSectionHeader.foreground' })}>
              Loading...
            </Text>
          )}
        </Stack>
      </Element>
    </>
  );
};
