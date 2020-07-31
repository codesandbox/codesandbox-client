import React from 'react';
import { useHistory } from 'react-router-dom';
import { useOvermind } from 'app/overmind';
import { dashboard as dashboardUrls } from '@codesandbox/common/lib/utils/url-generator';
import { Avatar, Text, Menu, Stack, Icon } from '@codesandbox/components';
import { sortBy } from 'lodash-es';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';

type Team = {
  type: 'team';
  id: string;
  name: string;
  avatarUrl: string | null;
};

type User = {
  type: 'user';
  id: string;
  username: string;
  avatarUrl: string;
};

interface WorkspaceSelectProps {
  activeAccount: Team | User;
  onSelect: (account: Team | User) => void;
}

export const WorkspaceSelect: React.FC<WorkspaceSelectProps> = React.memo(
  ({ activeAccount, onSelect }) => {
    const { state } = useOvermind();
    const { user, dashboard } = state;
    const history = useHistory();

    const name =
      activeAccount.type === 'user'
        ? activeAccount.username
        : activeAccount.name;

    return (
      <Stack
        css={css({
          width: '100%',
          height: '100%',
        })}
      >
        <Menu>
          <Stack
            as={Menu.Button}
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
                {activeAccount.type === 'team' ? (
                  <TeamAvatar
                    avatar={activeAccount.avatarUrl}
                    name={activeAccount.name}
                  />
                ) : (
                  <Avatar user={activeAccount} css={css({ size: 6 })} />
                )}
              </Stack>
              <Text size={4} weight="normal" maxWidth={140}>
                {name}
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
            <Menu.Item
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
              onSelect={() => {
                onSelect({
                  type: 'user',
                  username: user.username,
                  id: user.id,
                  avatarUrl: user.avatarUrl,
                });
              }}
            >
              <Stack align="center" gap={2}>
                <Avatar user={user} css={css({ size: 6 })} />
                <Text css={css({ width: '100%' })} size={3}>
                  {user.username} (Personal)
                </Text>

                {activeAccount.type === 'user' && <Icon name="simpleCheck" />}
              </Stack>
            </Menu.Item>
            {sortBy(dashboard.teams, t => t.name.toLowerCase()).map(team => (
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
                    type: 'team',
                    name: team.name,
                    id: team.id,
                    avatarUrl: team.avatarUrl,
                  })
                }
              >
                <TeamAvatar
                  avatar={team.avatarUrl}
                  name={team.name}
                  size="small"
                />
                <Text css={css({ width: '100%' })} size={3}>
                  {team.name}
                </Text>

                {activeAccount.type === 'team' &&
                  activeAccount.name === team.name && (
                    <Icon name="simpleCheck" />
                  )}
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
    );
  }
);
