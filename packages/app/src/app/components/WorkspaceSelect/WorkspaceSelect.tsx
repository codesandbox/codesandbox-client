import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import {
  Badge,
  Text,
  Menu,
  Stack,
  Icon,
  Tooltip,
} from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { SubscriptionStatus } from 'app/graphql/types';

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
    const { isFree } = useWorkspaceSubscription();

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

    // The <Menu /> component doesn't have a callback like `onOpenChange`
    // that we find in Radix. The "appropriate" solution would be to use
    // a render callback to tell if the menu is expanded or not. Since
    // our current implementation does not support render callbacks,
    // the easiest solution is to check for the `aria-expanded` attr
    // on the menu button.
    const trackOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
      const isExpanded = e.currentTarget?.getAttribute('aria-expanded');
      if (JSON.parse(isExpanded) === true) {
        track('Workspace Selector - open menu', {
          codesandbox: 'V1',
          event_source: 'UI',
        });
      }
    };

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
              onClick={trackOpen}
            >
              <Stack align="center" gap={1} css={{ paddingRight: 4 }}>
                <Text
                  size={16}
                  maxWidth={selectedTeam?.subscription ? 163 : 123}
                >
                  {isPersonalTeam ? 'Personal' : selectedTeam?.name}
                </Text>

                {isFree && <Badge variant="trial">Free</Badge>}
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
              }}
            >
              {workspaces.map(team => {
                const subscriptionStatus = team.subscription?.status;
                const isTeamFree = !(
                  subscriptionStatus === SubscriptionStatus.Active ||
                  subscriptionStatus === SubscriptionStatus.Trialing
                );

                return (
                  <Stack
                    as={Menu.Item}
                    key={team.id}
                    align="center"
                    gap={2}
                    css={{ borderBottom: '1px solid #343434' }}
                    onSelect={() => {
                      track('Workspace Selector - Change Active Team', {
                        codesandbox: 'V1',
                        event_source: 'UI',
                      });
                      onSelect(team.id);
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

                      {isTeamFree && <Badge variant="trial">Free</Badge>}
                    </Stack>
                  </Stack>
                );
              })}

              <Stack
                as={Menu.Item}
                align="center"
                gap={2}
                css={{
                  textAlign: 'left',
                }}
                onSelect={() => {
                  track('Workspace Selector - Create Team', {
                    codesandbox: 'V1',
                    event_source: 'UI',
                  });

                  openCreateTeamModal();
                }}
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
