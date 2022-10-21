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
  selectedTeamId: string;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ disabled, onSelect, selectedTeamId }) => {
    const state = useAppState();
    const { dashboard, user } = state;
    const { openCreateTeamModal } = useActions();

    if (dashboard.teams.length === 0 || !state.personalWorkspaceId) return null;

    const personalWorkspace = dashboard.teams.find(
      t => t.id === state.personalWorkspaceId
    )!;

    const selectedTeam = dashboard.teams.find(t => t.id === selectedTeamId);
    const isPersonalTeam = selectedTeamId === state.personalWorkspaceId;

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
                cursor: 'default',
                color: '#C2C2C2',
                paddingLeft: '28px',
                height: '36px',
                borderRadius: '2px 0 0 2px',
                '&:hover': {
                  backgroundColor: '#242424',
                },
              }}
            >
              <Stack align="center" gap={1} css={{ paddingRight: 4 }}>
                <Text
                  size={16}
                  maxWidth={selectedTeam.subscription ? 166 : 126}
                >
                  {isPersonalTeam ? 'Personal' : selectedTeam.name}
                </Text>

                {!selectedTeam.subscription && (
                  <Badge color="accent">Free</Badge>
                )}
              </Stack>

              <Icon name="chevronDown" size={8} />
            </Stack>

            <Menu.List
              css={{
                width: '100%',
                marginLeft: 7,
                marginTop: 4,
                borderRadius: '2px',
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
                  <Stack
                    align="center"
                    justify="space-between"
                    css={{ flex: 1 }}
                    gap={1}
                  >
                    <Text css={{ width: '100%' }} size={3}>
                      {team.id === state.personalWorkspaceId
                        ? 'Personal'
                        : team.name}
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
                  textAlign: 'left',
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
