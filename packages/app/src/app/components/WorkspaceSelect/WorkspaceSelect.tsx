import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Text, Menu, Stack, Icon, Tooltip } from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { SubscriptionType } from 'app/graphql/types';
import { MenuItem, Badge } from './elements';
import { BetaMenuItem, BetaActiveItem } from './BetaItem';

type Team = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

interface WorkspaceSelectProps {
  activeAccount: Team;
  disabled?: boolean;
  onSelect: (account: Team) => void;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ activeAccount, disabled, onSelect }) => {
    const state = useAppState();
    const { dashboard, user } = state;
    const history = useHistory();

    const isInBetaScreen = history.location.pathname === dashboardUrls.beta();
    const personalWorkspace = dashboard.teams.find(
      t => t.id === state.personalWorkspaceId
    )!;
    const workspaces = [
      personalWorkspace,
      ...sortBy(
        dashboard.teams.filter(t => t.id !== state.personalWorkspaceId),
        t => t.name.toLowerCase()
      ),
    ];

    return (
      <Tooltip
        label={
          disabled
            ? 'Selected sandbox(es) can not be forked outside of the workspace'
            : null
        }
      >
        <Stack css={css({ width: '100%', height: '100%' })}>
          <Menu>
            <Stack
              as={Menu.Button}
              disabled={disabled}
              justify="space-between"
              align="center"
              css={css({
                width: '100%',
                height: '100%',
                paddingLeft: 2,
                borderRadius: 0,
                '&:hover': {
                  backgroundColor: 'grays.600',
                },
              })}
            >
              {isInBetaScreen ? (
                <BetaActiveItem />
              ) : (
                <Stack gap={2} as="span" align="center">
                  <Stack as="span" align="center" justify="center">
                    <TeamAvatar
                      avatar={
                        state.activeTeamInfo?.avatarUrl ||
                        activeAccount.avatarUrl
                      }
                      name={activeAccount.name}
                    />
                  </Stack>
                  <Text size={4} weight="normal" maxWidth={140}>
                    {activeAccount.name}
                  </Text>
                </Stack>
              )}
              <Icon name="caret" size={8} />
            </Stack>

            <Menu.List
              css={css({
                width: '100%',
                marginTop: -2,
                backgroundColor: 'grays.600',
              })}
              style={{ backgroundColor: '#242424', borderColor: '#343434' }} // TODO: find a way to override reach styles without the selector mess
            >
              {workspaces.map(team => (
                <MenuItem
                  as={Menu.Item}
                  key={team.id}
                  align="center"
                  gap={2}
                  onSelect={() => {
                    onSelect({
                      name: team.name,
                      id: team.id,
                      avatarUrl: team.avatarUrl,
                    });

                    if (isInBetaScreen) {
                      history.push('/dashboard/all');
                    }
                  }}
                >
                  <TeamAvatar
                    avatar={
                      team.id === state.personalWorkspaceId && user
                        ? user.avatarUrl
                        : team.avatarUrl
                    }
                    name={team.name}
                    size="small"
                  />
                  <Stack align="center">
                    <Text css={css({ width: '100%' })} size={3}>
                      {team.name}
                      {team.id === state.personalWorkspaceId && ' (Personal)'}
                    </Text>

                    {[
                      SubscriptionType.TeamPro,
                      SubscriptionType.PersonalPro,
                    ].includes(team.subscription?.type) && <Badge>Pro</Badge>}
                  </Stack>

                  {activeAccount.id === team.id && !isInBetaScreen && (
                    <Icon name="simpleCheck" />
                  )}
                </MenuItem>
              ))}

              {/* TODO: Wrap pilot user */}
              <BetaMenuItem />

              <Stack
                as={Menu.Item}
                align="center"
                gap={2}
                css={css({
                  height: 10,
                  textAlign: 'left',
                  marginLeft: '1px',
                })}
                style={{ paddingLeft: 8 }}
                onSelect={() => history.push(dashboardUrls.createWorkspace())}
              >
                <Stack
                  justify="center"
                  align="center"
                  css={css({
                    size: 6,
                    borderRadius: 'small',
                    border: '1px solid',
                    borderColor: 'grays.500',
                  })}
                >
                  <Icon name="plus" size={10} />
                </Stack>
                <Text size={3}>Create a new workspace</Text>
              </Stack>
            </Menu.List>
          </Menu>
        </Stack>
      </Tooltip>
    );
  }
);
