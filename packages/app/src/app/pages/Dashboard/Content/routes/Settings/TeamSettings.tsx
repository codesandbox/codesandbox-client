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
import { Header } from 'app/pages/Dashboard/Components/Header';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { teamInviteLink } from '@codesandbox/common/lib/utils/url-generator';
import { sortBy } from 'lodash-es';
import { TeamAvatar } from 'app/components/TeamAvatar';
import {
  TeamMemberAuthorization,
  CurrentTeamInfoFragmentFragment,
} from 'app/graphql/types';
import { Card } from './components';
import { MemberList, User } from './components/MemberList';

export const TeamSettings = () => {
  const {
    state: {
      user: stateUser,
      activeTeam,
      activeTeamInfo: team,
      activeWorkspaceAuthorization,
    },
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
          paddingY: 10,
        })}
      >
        <Stack
          direction="vertical"
          gap={8}
          css={css({
            marginX: 'auto',
            width: `calc(100% - ${2 * GUTTER}px)`,
            maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
          })}
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
                      {activeWorkspaceAuthorization ===
                        TeamMemberAuthorization.Admin && (
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
              {activeWorkspaceAuthorization ===
                TeamMemberAuthorization.Admin && (
                <Button
                  marginTop={2}
                  css={css({
                    padding: 0,
                    textDecoration: 'underline',
                    width: 'auto',
                  })}
                  variant="link"
                  disabled={loading}
                  onClick={() =>
                    actions.modalOpened({ modal: 'deleteWorkspace' })
                  }
                >
                  Delete Workspace
                </Button>
              )}
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
              Members
            </Text>

            <Stack
              as="form"
              onSubmit={inviteLoading ? undefined : onInviteSubmit}
              css={{ display: 'flex', flexGrow: 1, maxWidth: 480 }}
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
              {activeWorkspaceAuthorization !==
                TeamMemberAuthorization.Read && (
                <Button
                  variant="secondary"
                  onClick={onCopyInviteUrl}
                  style={{ width: 'auto', marginLeft: 8 }}
                >
                  Copy Invite URL
                </Button>
              )}
            </Stack>
          </Stack>
          <div>
            <MemberList
              getPermission={user => getAuthorization(user, team)}
              getPermissionOptions={user => {
                const yourAuthorization = activeWorkspaceAuthorization;

                return yourAuthorization === TeamMemberAuthorization.Admin &&
                  user.id !== stateUser.id
                  ? [
                      {
                        label: 'Admin',
                        onSelect: () => {
                          actions.dashboard.changeAuthorization({
                            userId: user.id,
                            authorization: TeamMemberAuthorization.Admin,
                          });
                        },
                      },
                      {
                        label: 'Editor',
                        onSelect: () => {
                          actions.dashboard.changeAuthorization({
                            userId: user.id,
                            authorization: TeamMemberAuthorization.Write,
                          });
                        },
                      },
                      {
                        label: 'Viewer',
                        onSelect: () => {
                          actions.dashboard.changeAuthorization({
                            userId: user.id,
                            authorization: TeamMemberAuthorization.Read,
                          });
                        },
                      },
                    ]
                  : [];
              }}
              getActions={user => {
                const you = stateUser.id === user.id;
                const yourAuthorization = activeWorkspaceAuthorization;

                const options = [];

                if (you) {
                  options.push({
                    label: 'Leave Workspace',
                    onSelect: () => actions.dashboard.leaveTeam(),
                  });
                }

                if (
                  !you &&
                  yourAuthorization === TeamMemberAuthorization.Admin
                ) {
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
              getPermissionOptions={() => []}
              getActions={user => [
                {
                  label: 'Revoke Invitation',
                  onSelect: () =>
                    actions.dashboard.revokeTeamInvitation({
                      teamId: team.id,
                      userId: user.id,
                    }),
                },
              ]}
              users={sortBy(team.invitees, 'username')}
            />
          </div>
        </Stack>
      </Element>
    </>
  );
};

const getAuthorization = (
  user: User,
  team: CurrentTeamInfoFragmentFragment
): TeamMemberAuthorization => {
  const authorization = team.userAuthorizations.find(
    auth => auth.userId === user.id
  ).authorization;

  return authorization;
};
