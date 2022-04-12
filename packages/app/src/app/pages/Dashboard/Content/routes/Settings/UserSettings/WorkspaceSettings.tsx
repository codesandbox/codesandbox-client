import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  Stack,
  Text,
  Tooltip,
  IconButton,
  Element,
} from '@codesandbox/components';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';

import { Header } from '../../../../Components/Header';
import { Card } from '../components';
import { ManageSubscription } from './ManageSubscription';

export const WorkspaceSettings = () => {
  const { user, activeTeam } = useAppState();
  const actions = useActions();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<{ name: string; url: string } | null>(null);

  const getFile = async avatar => {
    const url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        resolve(e.target.result);
      };
      reader.onerror = reject;
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
    setLoading(true);
    try {
      await actions.dashboard.updateTeamAvatar({
        ...file,
        teamId: activeTeam,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  if (!user) {
    return <Header title="Settings" activeTeam={activeTeam} />;
  }

  return (
    <Element
      css={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1em',

        '@media (min-width: 768px)': {
          display: 'grid',
          'grid-template-columns': 'repeat(3, 1fr)',
        },
      }}
    >
      <Card css={{ 'grid-column': '1/3' }}>
        {editing ? (
          <Stack as="form" onSubmit={onSubmit} direction="vertical" gap={2}>
            <Stack gap={4}>
              <Element css={css({ position: 'relative', height: 56 })}>
                <Element css={css({ position: 'relative', height: 56 })}>
                  <Tooltip
                    label={`
                      Account managed by ${
                        user.provider === 'google' ? 'Google' : 'GitHub'
                      }
                      `}
                  >
                    <Stack
                      align="center"
                      justify="center"
                      css={css({
                        position: 'absolute',
                        bottom: 0,
                        transform: 'translateY(50%) translateX(50%)',
                        right: 0,
                        zIndex: 10,
                        backgroundColor: 'sideBar.background',
                        borderRadius: '50%',
                        width: 18,
                        height: 18,
                        border: '1px solid',
                        borderColor: 'sideBar.border',
                      })}
                    >
                      {user.provider === 'google' ? (
                        <GoogleIcon width="12" height="12" />
                      ) : (
                        <GitHubIcon width="12" height="12" />
                      )}
                    </Stack>
                  </Tooltip>
                  <Avatar
                    user={user}
                    css={css({ size: 14, opacity: 0.6 })}
                    file={file?.url}
                  />
                </Element>

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
                gap={2}
                css={{ width: 'calc(100% - 64px)' }}
              >
                <Stack justify="space-between">
                  <Text size={6} weight="bold" maxWidth="100%" variant="body">
                    {user.username}
                  </Text>
                  <IconButton
                    name="edit"
                    size={12}
                    title="Edit team"
                    onClick={() => setEditing(false)}
                  />
                </Stack>
                <Text size={3} maxWidth="100%">
                  {user.name}
                </Text>
                <Text size={3} maxWidth="100%" variant="muted">
                  {user.email}
                </Text>
                <Button
                  variant="link"
                  autoWidth
                  css={css({
                    height: 'auto',
                    fontSize: 3,
                    color: 'button.background',
                    padding: 0,
                  })}
                  onClick={() => {
                    if (user.deletionRequested) {
                      actions.dashboard.undoRequestAccountClosing();
                    } else {
                      actions.dashboard.requestAccountClosing();
                    }
                  }}
                >
                  {user.deletionRequested
                    ? 'Undo Account Deletion'
                    : 'Request Account Deletion'}
                </Button>
                <Stack justify="flex-start" gap={1}>
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
            </Stack>
          </Stack>
        ) : (
          <Stack gap={4}>
            <div style={{ position: 'relative', height: 56 }}>
              <Tooltip
                label={`
                      Account managed by ${
                        user.provider === 'google' ? 'Google' : 'GitHub'
                      }
                      `}
              >
                <Stack
                  align="center"
                  justify="center"
                  css={css({
                    position: 'absolute',
                    bottom: 0,
                    transform: 'translateY(50%) translateX(50%)',
                    right: 0,
                    zIndex: 10,
                    backgroundColor: 'sideBar.background',
                    borderRadius: '50%',
                    width: 18,
                    height: 18,
                    border: '1px solid',
                    borderColor: 'sideBar.border',
                  })}
                >
                  {user.provider === 'google' ? (
                    <GoogleIcon width="12" height="12" />
                  ) : (
                    <GitHubIcon width="12" height="12" />
                  )}
                </Stack>
              </Tooltip>
              <Avatar user={user} css={css({ size: 14 })} />
            </div>

            <Stack
              direction="vertical"
              gap={2}
              css={{ width: 'calc(100% - 64px)' }}
            >
              <Stack justify="space-between">
                <Text size={6} weight="bold" maxWidth="100%" variant="body">
                  {user.username}
                </Text>
                <IconButton
                  name="edit"
                  size={12}
                  title="Edit team"
                  onClick={() => setEditing(true)}
                />
              </Stack>
              <Text size={3} maxWidth="100%">
                {user.name}
              </Text>
              <Text size={3} maxWidth="100%" variant="muted">
                {user.email}
              </Text>
              <Button
                variant="link"
                autoWidth
                css={css({
                  height: 'auto',
                  fontSize: 3,
                  color: 'button.background',
                  padding: 0,
                })}
                onClick={() => {
                  if (user.deletionRequested) {
                    actions.dashboard.undoRequestAccountClosing();
                  } else {
                    actions.dashboard.requestAccountClosing();
                  }
                }}
              >
                {user.deletionRequested
                  ? 'Undo Account Deletion'
                  : 'Request Account Deletion'}
              </Button>
            </Stack>
          </Stack>
        )}
      </Card>

      <ManageSubscription />
    </Element>
  );
};
