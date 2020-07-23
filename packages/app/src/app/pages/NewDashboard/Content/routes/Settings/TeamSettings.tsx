import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import {
  Button,
  Element,
  Grid,
  Stack,
  Text,
  Input,
  Textarea,
  IconButton,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { Header } from 'app/pages/NewDashboard/Components/Header';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import { Card } from './components';
import { MemberList } from './components/MemberList';

export const TeamSettings = () => {
  const {
    state: { user: stateUser, activeTeam, activeTeamInfo: team },
    actions,
    effects,
  } = useOvermind();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);

  const getFile = async avatar => {
    const url = await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(avatar);
    });

    const stringUrl = url as string;

    setFile({
      name: avatar.name,
      url: stringUrl,
    });
  };

  const onSubmit = async event => {
    event.preventDefault();
    const name = event.target.name.value;
    const description = event.target.description.value;
    setLoading(true);
    try {
      await actions.dashboard.setTeamInfo({
        name,
        description,
        file,
      });
      setLoading(false);
      setEditing(false);
    } catch {
      setLoading(false);
    }
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

  if (!team || !stateUser) {
    return <Header title="Workspace Settings" activeTeam={null} />;
  }

  const onCopyInviteUrl = async event => {
    event.preventDefault();

    effects.browser.copyToClipboard(teamInviteLink(team.inviteToken));
    effects.notificationToast.success('Copied Team Invite URL!');
  };

  const created = team.users.find(user => user.id === team.creatorId);
  return (
    <>
      <Helmet>
        <title>Workspace Settings - CodeSandbox</title>
      </Helmet>
      <Header title="Workspace Settings" activeTeam={activeTeam} />
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
          css={css({ maxWidth: 1100, marginX: 'auto' })}
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
                  <Stack gap={4}>
                    <Element css={css({ position: 'relative', height: 55 })}>
                      <TeamAvatar
                        style={{
                          opacity: 0.6,
                        }}
                        name={team.name}
                        avatar={file ? file.url : team.avatarUrl}
                        size="bigger"
                      />
                      <label htmlFor="avatar" aria-label="Upload your avatar">
                        <input
                          css={css({
                            width: '0.1px',
                            height: '0.1px',
                            opacity: 0,
                            overflow: 'hidden',
                            position: 'absolute',
                            zIndex: -1,
                          })}
                          type="file"
                          onChange={e => getFile(e.target.files[0])}
                          id="avatar"
                          name="avatar"
                          accept="image/png, image/jpeg"
                        />
                        <Element
                          css={css({
                            width: '100%',
                            height: '100%',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            cursor: 'pointer',
                          })}
                        >
                          <svg
                            width={18}
                            height={15}
                            fill="none"
                            viewBox="0 0 18 15"
                            css={css({
                              position: 'absolute',
                              left: '50%',
                              top: '50%',
                              transform: 'translate(-50%, -50%)',
                            })}
                          >
                            <path
                              fill="#fff"
                              fillRule="evenodd"
                              d="M13 2h3.286C17.233 2 18 2.768 18 3.714v9.572c0 .947-.767 1.714-1.714 1.714H1.714A1.714 1.714 0 010 13.286V3.714C0 2.768.768 2 1.714 2H5a4.992 4.992 0 014-2c1.636 0 3.088.786 4 2zm0 6a4 4 0 11-8 0 4 4 0 018 0zM8.8 6h.4v1.8H11v.4H9.2V10h-.4V8.2H7v-.4h1.8V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </Element>
                      </label>
                    </Element>
                    <Stack
                      direction="vertical"
                      css={css({ width: '100%' })}
                      gap={2}
                    >
                      <Input
                        type="text"
                        name="name"
                        required
                        defaultValue={team.name}
                        placeholder="Enter team name"
                      />
                      <Textarea
                        name="description"
                        defaultValue={team.description}
                        placeholder="Enter a description for your team"
                      />
                    </Stack>
                  </Stack>
                  <Stack justify="flex-end">
                    <Button
                      variant="link"
                      css={{ width: 100 }}
                      disabled={loading}
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      css={{ width: 100 }}
                      disabled={loading}
                      loading={loading}
                    >
                      Save
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack gap={4}>
                  <TeamAvatar
                    name={team.name}
                    avatar={team.avatarUrl}
                    size="bigger"
                  />
                  <Stack direction="vertical" gap={2} css={{ width: '100%' }}>
                    <Stack justify="space-between">
                      <Text size={6} weight="bold">
                        {team.name}
                      </Text>
                      {team.userAuthorization === 'ADMIN' && (
                        <IconButton
                          name="edit"
                          size={12}
                          title="Edit team"
                          onClick={() => setEditing(true)}
                        />
                      )}
                    </Stack>
                    <Text size={3}>
                      {team.joinedPilotAt
                        ? 'Team Pro Pilot'
                        : 'Community Plan (Free)'}
                    </Text>
                    <Text size={3} variant="muted">
                      {team.description}
                    </Text>
                  </Stack>
                </Stack>
              )}
            </Card>

            <Card>
              <Stack direction="vertical" gap={4}>
                <Text size={6} weight="bold">
                  {team.users.length}{' '}
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
            <Text
              css={css({
                display: 'flex',
                alignItems: 'center',
              })}
              size={4}
            >
              Members{' '}
              {team.userAuthorization !== 'READ' && (
                <IconButton
                  css={css({ marginLeft: 2 })}
                  size={12}
                  title="Copy Invite URL"
                  name="link"
                  onClick={onCopyInviteUrl}
                />
              )}
            </Text>

            <Stack
              as="form"
              onSubmit={inviteLoading ? undefined : onInviteSubmit}
              css={{ display: 'flex', flexGrow: 1, maxWidth: 320 }}
            >
              <UserSearchInput
                inputValue={inviteValue}
                allowSelf={false}
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
          <div>
            <MemberList
              getPermission={user => getAuthorization(user, team)}
              getActions={user => {
                const you = stateUser.id === user.id;
                const yourAuthorization = getAuthorization(stateUser, team);

                const userAuthorization = getAuthorization(user, team);

                const options = [];

                if (yourAuthorization === 'ADMIN') {
                  if (userAuthorization === 'READ') {
                    options.push({
                      label: 'Grant Edit access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'WRITE',
                        });
                      },
                    });
                    options.push({
                      label: 'Grant Admin access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'ADMIN',
                        });
                      },
                    });
                  } else if (userAuthorization === 'WRITE') {
                    options.push({
                      label: 'Only allow View access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'READ',
                        });
                      },
                    });
                    options.push({
                      label: 'Grant Admin access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'ADMIN',
                        });
                      },
                    });
                  } else if (userAuthorization === 'ADMIN') {
                    options.push({
                      label: 'Only allow View access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'READ',
                        });
                      },
                    });
                    options.push({
                      label: 'Remove Admin access',
                      onSelect: () => {
                        actions.dashboard.changeAuthorization({
                          userId: user.id,
                          authorization: 'WRITE',
                        });
                      },
                    });
                  }
                }

                if (you) {
                  options.push({
                    label: 'Leave Team',
                    onSelect: () => actions.dashboard.leaveTeam(),
                  });
                }

                if (!you && yourAuthorization === 'ADMIN') {
                  options.push({
                    label: 'Remove Member',
                    onSelect: () => actions.dashboard.removeFromTeam(user.id),
                  });
                }

                return options;
              }}
              users={sortBy(team.users, 'username')}
            />

            <MemberList
              getPermission={() => 'PENDING'}
              getActions={user =>
                [
                  {
                    label: 'Revoke Invitation',
                    onSelect: () =>
                      actions.dashboard.revokeTeamInvitation({
                        teamId: team.id,
                        userId: user.id,
                      }),
                  },
                ].filter(Boolean)
              }
              users={sortBy(team.invitees, 'username')}
            />
          </div>
        </Stack>
      </Element>
    </>
  );
};

const getAuthorization = (user, team) => {
  let authorization;

  if (team.userAuthorizations) {
    authorization = team.userAuthorizations.find(
      auth => auth.userId === user.id
    ).authorization;
  } else if (user.id === team.creatorId) {
    // backward compatible
    authorization = 'ADMIN';
  } else {
    // backward compatible
    authorization = 'WRITE';
  }

  return authorization;
};
