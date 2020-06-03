import React, { useEffect, useState } from 'react';
import { useOvermind } from 'app/overmind';
import {
  Button,
  Element,
  Grid,
  Column,
  List,
  ListAction,
  Menu,
  Stack,
  Text,
  Input,
  Textarea,
  IconButton,
  Avatar,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { Card } from './components';

export const TeamSettings = () => {
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

  const [editing, setEditing] = useState(false);
  const onSubmit = event => {
    event.preventDefault();
    // TODO: Save team
  };

  const [inviteValue, setInviteValue] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const onInviteSubmit = async event => {
    event.preventDefault();
    setInviteLoading(true);
    setInviteValue('');
    await actions.dashboard.inviteToTeam(inviteValue);
    setInviteLoading(false);
  };

  if (!team) {
    return <Header title="Team settings" />;
  }
  const created = team.users.find(user => user.id === team.creatorId);
  return (
    <>
      <Header title="Team settings" />
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
          paddingX: 4,
          paddingY: 10,
        })}
      >
        <Stack
          direction="vertical"
          gap={8}
          css={css({ maxWidth: 992, marginX: 'auto' })}
        >
          <Grid
            columnGap={4}
            css={css({
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            })}
          >
            <Card>
              {editing ? (
                <Stack
                  as="form"
                  onSubmit={onSubmit}
                  direction="vertical"
                  gap={2}
                >
                  <Input
                    type="text"
                    name="name"
                    defaultValue={team.name}
                    placeholder="Enter team name"
                  />
                  <Textarea
                    name="description"
                    defaultValue={team.description}
                    placeholder="Enter a description for your team"
                  />
                  <Stack justify="flex-end">
                    <Button
                      variant="link"
                      css={{ width: 100 }}
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" css={{ width: 100 }}>
                      Save
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack direction="vertical" gap={2}>
                  <Stack justify="space-between">
                    <Text size={6} weight="bold">
                      {team.name}
                    </Text>
                    <IconButton
                      name="edit"
                      size={12}
                      title="Edit team"
                      onClick={() => setEditing(true)}
                    />
                  </Stack>
                  <Text size={3}>Community Plan (Free)</Text>
                  <Text size={3} variant="muted">
                    {team.description}
                  </Text>
                </Stack>
              )}
            </Card>

            <Card>
              <Stack direction="vertical" gap={4}>
                <Text size={6} weight="bold">
                  {team.users.length} team{' '}
                  {team.users.length === 1 ? 'member' : 'members'}
                </Text>
                <Text size={3} variant="muted">
                  Created by {created.username}
                </Text>
              </Stack>
            </Card>

            <Card style={{ backgroundColor: 'white' }}>
              <Stack direction="vertical" gap={4}>
                <Text size={6} weight="bold" css={css({ color: 'grays.800' })}>
                  Team Pro
                </Text>
                <Text
                  size={3}
                  variant="muted"
                  css={css({ color: 'grays.800' })}
                >
                  Get early access and product updates?
                </Text>
                <Button
                  as="a"
                  href="https://airtable.com/shrlgLSJWiX8rYqyG"
                  target="_blank"
                  marginTop={2}
                >
                  Sign up
                </Button>
              </Stack>
            </Card>
          </Grid>
          <Stack align="center" justify="space-between" gap={2}>
            <Text size={4}>Members</Text>
            <Stack
              as="form"
              onSubmit={inviteLoading ? undefined : onInviteSubmit}
              css={{ display: 'flex', flexGrow: 1, maxWidth: 320 }}
            >
              <UserSearchInput
                inputValue={inviteValue}
                onInputValueChange={val => {
                  setInviteValue(val);
                }}
              />
              <Button
                type="submit"
                loading={inviteLoading}
                style={{ width: 'auto', marginLeft: 8 }}
              >
                Add Member
              </Button>
            </Stack>
          </Stack>
          <List>
            {team.users.map(user => {
              const teamOwner = stateUser.id === team.creatorId;
              const you = stateUser.id === user.id;

              return (
                <ListAction
                  key={user.username}
                  align="center"
                  justify="space-between"
                  css={css({
                    height: 64,
                    borderBottom: '1px solid',
                    borderColor: 'grays.600',
                  })}
                >
                  <Grid css={{ width: '100%' }}>
                    <Column span={6}>
                      <Stack gap={4} align="center" css={{ height: '100%' }}>
                        <Avatar user={user} />
                        <Text size={3}>{user.username}</Text>
                      </Stack>
                    </Column>
                    <Column span={6}>
                      <Stack
                        justify="space-between"
                        align="center"
                        css={{ height: '100%' }}
                      >
                        <Text variant="muted" size={3}>
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
                                <Menu.Item
                                  onSelect={actions.dashboard.leaveTeam}
                                >
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
                        ) : null}
                      </Stack>
                    </Column>
                  </Grid>
                </ListAction>
              );
            })}
          </List>
        </Stack>
      </Element>
    </>
  );
};
