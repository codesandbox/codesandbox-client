import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Text, Menu, Stack, Icon, Tooltip } from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { SubscriptionType } from 'app/graphql/types';
import { MenuItem, Badge } from './elements';

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
    const { openCreateTeamModal } = useActions();

    if (!dashboard.teams || !state.personalWorkspaceId) return null;

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
                marginLeft: 0,
                '&:hover': {
                  backgroundColor: 'grays.600',
                },
              })}
            >
              <Stack gap={2} as="span" align="center">
                <Stack as="span" align="center" justify="center">
                  <TeamAvatar
                    avatar={
                      state.activeTeamInfo?.avatarUrl || activeAccount.avatarUrl
                    }
                    name={activeAccount.name}
                  />
                </Stack>
                <Text size={14} weight="normal" maxWidth={140}>
                  {activeAccount.name}
                </Text>
              </Stack>

              <Icon name="chevronDown" size={8} />
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
                  onSelect={() =>
                    onSelect({
                      name: team.name,
                      id: team.id,
                      avatarUrl: team.avatarUrl,
                    })
                  }
                >
                  <TeamAvatar
                    avatar={
                      team.id === state.personalWorkspaceId && user
                        ? user.avatarUrl
                        : team.avatarUrl
                    }
                    name={team.name}
                    size="small"
                    style={{ overflow: 'hidden' }}
                  />
                  <Stack align="center">
                    <Text css={css({ width: '100%' })} size={3}>
                      {team.name}
                    </Text>

                    {[
                      SubscriptionType.TeamPro,
                      SubscriptionType.PersonalPro,
                    ].includes(team.subscription?.type) && <Badge>Pro</Badge>}
                  </Stack>
                </MenuItem>
              ))}

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
                onSelect={openCreateTeamModal}
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
                <Text size={3}>Create a new team</Text>
              </Stack>
            </Menu.List>
          </Menu>
        </Stack>
      </Tooltip>
    );
  }
);
