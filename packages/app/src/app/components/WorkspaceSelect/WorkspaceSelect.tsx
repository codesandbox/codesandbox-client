import React from 'react';
import { useAppState } from 'app/overmind';
import { Badge, Text, Menu, Stack, Icon } from '@codesandbox/components';
import { SubscriptionStatus } from 'app/graphql/types';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceSubscription } from 'app/hooks/useWorkspaceSubscription';
import { useHistory } from 'react-router-dom';

interface WorkspaceSelectProps {
  disabled?: boolean;
  onSelect: (teamId: string) => void;
  selectedTeamId: string;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ disabled, onSelect, selectedTeamId }) => {
    const state = useAppState();
    const history = useHistory();
    const { dashboard } = state;
    const { isPro } = useWorkspaceSubscription();

    if (dashboard.teams.length === 0) return null;

    const primaryWorkspace = dashboard.teams.find(
      t => t.id === state.primaryWorkspaceId
    );

    const selectedTeam = dashboard.teams.find(t => t.id === selectedTeamId);

    const workspaces = [
      ...(primaryWorkspace ? [primaryWorkspace] : []),
      ...sortBy(
        dashboard.teams.filter(t => t.id !== state.primaryWorkspaceId),
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
        track('Workspace Selector - open menu');
      }
    };

    return (
      <Menu>
        <Stack
          as={Menu.Button}
          disabled={disabled}
          justify="space-between"
          gap={2}
          align="center"
          css={{
            width: '100%',
            cursor: 'pointer',
            color: '#cccccc',
            paddingRight: '8px',
            borderRadius: '4px',
            height: '28px',
            '.chevron': {
              translate: 0,
              transition: 'translate 0.125s ease-out',
            },

            '&:hover': {
              '.chevron': {
                translate: '0 3px',
              },
            },
          }}
          onClick={trackOpen}
        >
          <Stack align="center" gap={2}>
            <Text
              size={14}
              lineHeight="16px"
              maxWidth={
                selectedTeam?.subscription?.status === SubscriptionStatus.Active
                  ? 170
                  : 210
              }
            >
              {selectedTeam?.name}
            </Text>

            {isPro && <Badge variant="pro">Pro</Badge>}
          </Stack>

          <Icon className="chevron" name="chevronDown" size={8} />
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
            const isProWorkspace =
              team.subscription?.status === SubscriptionStatus.Active;

            if (team.id !== state.activeTeam) {
              return null;
            }

            return (
              <Stack
                as={Menu.Item}
                key={team.id}
                align="center"
                gap={2}
                css={{ borderBottom: '1px solid #343434' }}
                onSelect={() => {
                  track('Workspace Selector - Change Active Team');
                  onSelect(team.id);
                }}
              >
                <TeamAvatar
                  avatar={team.avatarUrl}
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
                    {team.name}
                  </Text>

                  {isProWorkspace && <Badge variant="pro">Pro</Badge>}
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
              history.push('/create-workspace');
              track('Workspace Selector - Create Workspace');
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
            <Text size={3}>Create workspace</Text>
          </Stack>
        </Menu.List>
      </Menu>
    );
  }
);
