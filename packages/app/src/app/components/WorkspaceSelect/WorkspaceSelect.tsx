import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import { Text, Menu, Stack, Icon, Tooltip } from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { Badge } from 'app/components/Badge';
import { MenuItem } from './elements';

interface WorkspaceSelectProps {
  disabled?: boolean;
  onSelect: (teamId: string) => void;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ disabled, onSelect }) => {
    const state = useAppState();
    const { dashboard, user, activeTeamInfo } = state;
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
        <Stack css={{ flex: 1, height: '100%' }}>
          <Menu>
            <Stack
              as={Menu.Button}
              disabled={disabled}
              justify="space-between"
              align="center"
              css={{
                width: '100%',
                height: '100%',
                marginLeft: 0,
                cursor: 'default',
                color: '#C2C2C2',
                borderRadius: '2px 0 0 2px',
                '&:hover': {
                  backgroundColor: '#242424',
                },
              }}
            >
              <Stack align="center" gap={1} css={{ paddingRight: 4 }}>
                <Text
                  size={16}
                  maxWidth={activeTeamInfo.subscription ? 172 : 132}
                >
                  {activeTeamInfo.name}
                </Text>

                {!activeTeamInfo.subscription && (
                  <Badge color="accent">Free</Badge>
                )}
              </Stack>

              <Icon name="chevronDown" size={8} />
            </Stack>

            <Menu.List
              css={{
                width: '100%',
                marginTop: -2,
                backgroundColor: '#242424',
                borderColor: '#343434',
              }}
            >
              {workspaces.map(team => (
                <MenuItem
                  as={Menu.Item}
                  key={team.id}
                  align="center"
                  gap={2}
                  onSelect={() => onSelect(team.id)}
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
                  <Stack align="center" gap={1}>
                    <Text css={{ width: '100%' }} size={3}>
                      {team.name}
                    </Text>

                    {!team.subscription && <Badge color="accent">Free</Badge>}
                  </Stack>
                </MenuItem>
              ))}

              <Stack
                as={Menu.Item}
                align="center"
                gap={2}
                css={{
                  height: 40,
                  textAlign: 'left',
                  paddingLeft: 12,
                }}
                onSelect={openCreateTeamModal}
              >
                <Stack
                  justify="center"
                  align="center"
                  css={{
                    width: 24,
                    height: 24,
                    borderRadius: '2px',
                    border: '1px solid #999',
                  }}
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
