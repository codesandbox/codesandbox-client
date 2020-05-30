import {
  Button,
  Element,
  Grid,
  List,
  ListAction,
  Menu,
  Stack,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { useOvermind } from 'app/overmind';
import React, { useEffect, useState } from 'react';

import { Header } from '../../../Components/Header';
import { randomColor } from '../../utils';
import { Box } from './components/Box';
import { Text } from './components/Typography';

export const TeamSettings = () => {
  const [loading, setLoading] = useState(false);
  const [inviteValue, setInviteValue] = useState('');
  const {
    state: {
      user: stateUser,
      dashboard: { activeTeamInfo: team },
    },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.getTeam();
  }, [actions.dashboard]);

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setInviteValue('');
    await actions.dashboard.inviteToTeam(inviteValue);
    setLoading(false);
  };

  if (!team) {
    return <Header title="Settings" />;
  }
  const created = team.users.find(user => user.id === team.creatorId);
  return (
    <>
      <Header />
      <Grid
        columnGap={4}
        css={css({
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        })}
      >
        <Box>
          <Stack gap={4} align="flex-start">
            {team.avatarUrl ? (
              <img src={team.avatarUrl} width="55" alt={team.name} />
            ) : (
              <Stack
                align="center"
                justify="center"
                css={css({
                  minWidth: 55,
                  width: 55,
                  height: 55,
                  borderRadius: 'medium',
                  color: 'grays.800',
                  fontSize: 7,
                  background: randomColor,
                  fontWeight: 'bold',
                })}
              >
                {team.name.charAt(0)}
              </Stack>
            )}

            <Element>
              <Text weight="bold" block marginBottom={4} size={6}>
                {team.name}
              </Text>
              <Text>Community Plan (Free)</Text>
              <Text>{team.description}</Text>
            </Element>
          </Stack>
        </Box>
        <Box
          title={`${team.users.length} Team Member${
            team.users.length === 1 ? '' : 's'
          }`}
        >
          <Text>Created by {created.username}</Text>
        </Box>
        <Box white title="Team Pro">
          <Text white marginBottom={6}>
            Get early access and product updates?
          </Text>
          <Button
            href="https://airtable.com/shrlgLSJWiX8rYqyG"
            as="a"
            target="_blank"
          >
            Subscribe to Pro
          </Button>
        </Box>
      </Grid>
      <Stack
        align="center"
        justify="space-between"
        marginBottom={7}
        marginTop={9}
      >
        <Text size={4}>Members</Text>
        <form
          style={{ display: 'flex', minWidth: 400 }}
          onSubmit={loading ? undefined : onSubmit}
        >
          <UserSearchInput
            inputValue={inviteValue}
            onInputValueChange={val => {
              setInviteValue(val);
            }}
          />
          <Button
            type="submit"
            loading={loading}
            style={{ width: 'auto', marginLeft: 8 }}
          >
            {loading ? 'Adding Member...' : 'Add Member'}
          </Button>
        </form>
      </Stack>
      <List>
        {team.users.map(user => {
          const teamOwner = stateUser.id === team.creatorId;
          const you = stateUser.id === user.id;
          return (
            <ListAction
              align="center"
              justify="space-between"
              css={css({
                height: 84,
                borderWidth: 0,
                borderBottomWidth: 1,
                borderStyle: 'solid',
                borderBottomColor: 'grays.600',
              })}
            >
              <Stack gap={4} align="center">
                <img src={user.avatarUrl} width={32} alt={user.username} />
                <span style={{ color: 'white', width: 300 }}>
                  {user.username}
                </span>
              </Stack>
              <Text css={css({ width: 100 })}>
                {user.id === team.creatorId ? 'Admin' : 'Member'}
              </Text>
              {you || teamOwner ? (
                <Menu>
                  <Menu.IconButton
                    name="more"
                    size={9}
                    title="Member options"
                  />
                  <Menu.List>
                    {you ? (
                      <Menu.Item onSelect={actions.dashboard.leaveTeam}>
                        Leave Team
                      </Menu.Item>
                    ) : null}
                    {teamOwner && !you ? (
                      <Menu.Item
                        onSelect={() =>
                          actions.dashboard.removeFromTeam(user.id)
                        }
                      >
                        Remove Member
                      </Menu.Item>
                    ) : null}
                  </Menu.List>
                </Menu>
              ) : (
                <Element style={{ width: 26, height: 26 }} />
              )}
            </ListAction>
          );
        })}
      </List>
    </>
  );
};
