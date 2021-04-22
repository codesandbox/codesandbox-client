import React from 'react';
import { useHistory } from 'react-router-dom';
import { useAppState } from 'app/overmind';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Text, Menu, Stack, Icon, Tooltip } from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';

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
              <Stack gap={2} as="span" align="center">
                <Stack as="span" align="center" justify="center">
                  <TeamAvatar
                    avatar={activeAccount.avatarUrl}
                    name={activeAccount.name}
                  />
                </Stack>
                <Text size={4} weight="normal" maxWidth={140}>
                  {activeAccount.name}
                </Text>
              </Stack>
              <Icon name="caret" size={8} />
            </Stack>
            <Menu.List
              css={css({
                width: '100%',
                marginLeft: 2,
                marginTop: '-4px',
                backgroundColor: 'grays.600',
              })}
              style={{ backgroundColor: '#242424', borderColor: '#343434' }} // TODO: find a way to override reach styles without the selector mess
            >
              {workspaces.map(team => (
                <Stack
                  as={Menu.Item}
                  key={team.id}
                  align="center"
                  gap={2}
                  css={css({
                    height: 10,
                    textAlign: 'left',
                    backgroundColor: 'grays.600',
                    borderBottom: '1px solid',
                    borderColor: 'grays.500',

                    '&[data-reach-menu-item][data-component=MenuItem][data-selected]': {
                      backgroundColor: 'grays.500',
                    },
                  })}
                  style={{ paddingLeft: 8 }}
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
                  />
                  <Text css={css({ width: '100%' })} size={3}>
                    {team.name}
                    {team.id === state.personalWorkspaceId && ' (Personal)'}
                  </Text>

                  {activeAccount.id === team.id && <Icon name="simpleCheck" />}
                </Stack>
              ))}
              <Stack
                as={Menu.Item}
                align="center"
                gap={2}
                css={css({
                  height: 10,
                  textAlign: 'left',
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
