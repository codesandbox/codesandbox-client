import React from 'react';
import { useActions, useAppState } from 'app/overmind';
import { TeamType } from 'app/graphql/types';
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
import { determineSpecialBadges } from 'app/utils/teams';
import { useHistory } from 'react-router';

interface WorkspaceSelectProps {
  disabled?: boolean;
  onSelect: (teamId: string) => void;
  selectedTeamId: string;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ disabled, onSelect, selectedTeamId }) => {
    const state = useAppState();
    const actions = useActions();
    const { dashboard, user } = state;
    const history = useHistory();
    const {
      isLegacyFreeTeam,
      isLegacyPersonalPro,
      isInactiveTeam,
    } = useWorkspaceSubscription();

    if (dashboard.teams.length === 0) return null;

    const personalWorkspace = dashboard.teams.find(
      t => t.type === TeamType.Personal
    )!;

    const selectedTeam = dashboard.teams.find(t => t.id === selectedTeamId);

    const workspaces = [
      personalWorkspace,
      ...sortBy(
        dashboard.teams.filter(
          t =>
            t.type === TeamType.Team &&
            // New teams with no subscription information are automatically filtered out
            !(t.legacy === false && t.subscription === null)
        ),
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
                cursor: 'pointer',
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
                  {selectedTeam?.name}
                </Text>

                {isLegacyFreeTeam && <Badge variant="trial">Free</Badge>}
                {isLegacyPersonalPro && <Badge variant="pro">Pro</Badge>}
                {isInactiveTeam && <Badge variant="neutral">Inactive</Badge>}
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
                const {
                  isPersonalProLegacy,
                  isTeamFreeLegacy,
                  isInactive,
                } = determineSpecialBadges(team, state.environment.isOnPrem);

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
                        team.type === TeamType.Personal && user
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
                        {team.name}
                      </Text>

                      {isTeamFreeLegacy && <Badge variant="trial">Free</Badge>}
                      {isPersonalProLegacy && <Badge variant="pro">Pro</Badge>}
                      {isInactive && <Badge variant="neutral">Inactive</Badge>}
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
                  if (state.environment.isOnPrem) {
                    actions.openCreateTeamModal({ step: 'create' });
                  } else {
                    track('Workspace Selector - Create Team', {
                      codesandbox: 'V1',
                      event_source: 'UI',
                    });

                    history.push('/pro');
                  }
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
                <Text size={3}>
                  {state.environment.isOnPrem
                    ? 'Create workspace'
                    : 'Create a pro workspace'}
                </Text>
              </Stack>
            </Menu.List>
          </Menu>
        </Stack>
      </Tooltip>
    );
  }
);
