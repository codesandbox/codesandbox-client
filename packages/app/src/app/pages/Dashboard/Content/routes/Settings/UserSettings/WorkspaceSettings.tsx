import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import {
  Avatar,
  Button,
  Grid,
  Stack,
  Text,
  Tooltip,
  Icon,
  Link,
  IconButton,
  Element,
} from '@codesandbox/components';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { SubscriptionOrigin } from 'app/graphql/types';

import { Header } from '../../../../Components/Header';
import { Card } from '../components';

export const WorkspaceSettings = () => {
  const { user, activeTeam, activeTeamInfo } = useAppState();
  const actions = useActions();

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
    setLoading(true);
    try {
      await actions.dashboard.updateTeamAvatar({
        ...file,
        teamId: activeTeam,
      });
      setLoading(false);
      setEditing(false);
    } catch {
      setLoading(false);
    }
  };

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  if (!user) {
    return <Header title="Settings" activeTeam={activeTeam} />;
  }

  // @ts-ignore
  const activeSubscription = activeTeamInfo?.subscription;

  return (
    <Grid
      columnGap={4}
      css={css({
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      })}
    >
      <Card>
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
                    file={file ? file.url : null}
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
                  <Text size={6} weight="bold" maxWidth="100%" variant="muted">
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
                    actions.dashboard.requestAccountClosing();
                  }}
                >
                  Request Account Deletion
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
                <Text size={6} weight="bold" maxWidth="100%" variant="muted">
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
                  actions.dashboard.requestAccountClosing();
                }}
              >
                Request Account Deletion
              </Button>
            </Stack>
          </Stack>
        )}
      </Card>

      <Card>
        <Stack direction="vertical" gap={2}>
          <Stack direction="vertical" gap={2}>
            <Text size={6} weight="bold" maxWidth="100%">
              Plan
            </Text>
            <Text size={3} maxWidth="100%" variant="muted">
              {activeSubscription ? 'Personal Pro' : 'Personal (free)'}
            </Text>
            {activeSubscription ? (
              <div>
                {['LEGACY', 'PATRON'].includes(activeSubscription.origin) ? (
                  <Stack direction="vertical" gap={2}>
                    <Button
                      autoWidth
                      variant="link"
                      css={css({
                        height: 'auto',
                        fontSize: 3,
                        color: 'button.background',
                        padding: 0,
                      })}
                      onClick={() => {
                        actions.modalOpened({
                          modal: 'preferences',
                          itemId: 'paymentInfo',
                        });
                      }}
                    >
                      Update payment information
                    </Button>
                    <Button
                      autoWidth
                      variant="link"
                      css={css({
                        height: 'auto',
                        fontSize: 3,
                        color: 'errorForeground',
                        padding: 0,
                      })}
                      onClick={() => actions.patron.cancelSubscriptionClicked()}
                    >
                      Downgrade plan
                    </Button>
                  </Stack>
                ) : (
                  <Stack direction="vertical" gap={2}>
                    <Link
                      size={3}
                      variant="active"
                      href={activeSubscription.updateBillingUrl}
                      css={css({ fontWeight: 'medium' })}
                    >
                      Update payment information
                    </Link>
                    <Link
                      size={3}
                      variant="active"
                      href="/pro"
                      css={css({ fontWeight: 'medium' })}
                    >
                      Change billing interval
                    </Link>
                    {activeSubscription.cancelAt ? (
                      <Text size={3} css={css({ color: 'orange' })}>
                        Your subscription expires on{' '}
                        {format(new Date(activeSubscription.cancelAt), 'PP')}.{' '}
                        <Button
                          autoWidth
                          variant="link"
                          css={css({
                            color: 'inherit',
                            padding: 0,
                            textDecoration: 'underline',
                            fontSize: 3,
                          })}
                          onClick={() =>
                            actions.pro.reactivateWorkspaceSubscription()
                          }
                        >
                          Reactivate
                        </Button>
                      </Text>
                    ) : (
                      <Button
                        autoWidth
                        variant="link"
                        css={css({
                          height: 'auto',
                          fontSize: 3,
                          color: 'errorForeground',
                          padding: 0,
                        })}
                        onClick={() =>
                          actions.pro.cancelWorkspaceSubscription()
                        }
                      >
                        Cancel subscription
                      </Button>
                    )}
                  </Stack>
                )}
              </div>
            ) : null}
          </Stack>
        </Stack>
      </Card>
      {activeSubscription ? (
        <Card>
          <Stack direction="vertical" gap={2}>
            <Stack direction="vertical" gap={2}>
              <Text size={6} weight="bold" maxWidth="100%">
                Invoice details
              </Text>
              {activeTeamInfo?.subscription && (
                <div>
                  {activeTeamInfo?.subscription.origin ===
                  SubscriptionOrigin.Patron ? (
                    <Text size={3} variant="muted">
                      USD {user?.subscription.amount}{' '}
                    </Text>
                  ) : (
                    <div>
                      {!activeTeamInfo?.subscription.cancelAt ? (
                        <Tooltip
                          label={`Next invoice of ${
                            activeTeamInfo?.subscription.currency
                          } ${(
                            (activeTeamInfo?.subscription.quantity *
                              activeTeamInfo?.subscription.unitPrice) /
                            100
                          ).toFixed(2)} (excl. tax) scheduled for ${format(
                            new Date(activeTeamInfo?.subscription.nextBillDate),
                            'PP'
                          )}`}
                        >
                          <Stack align="center" gap={1}>
                            <Text size={3} variant="muted">
                              Next invoice:{' '}
                              {activeTeamInfo?.subscription.currency}{' '}
                              {(
                                (activeTeamInfo?.subscription.quantity *
                                  activeTeamInfo?.subscription.unitPrice) /
                                100
                              ).toFixed(2)}{' '}
                            </Text>
                            <Text variant="muted">
                              <Icon name="info" size={12} />
                            </Text>
                          </Stack>
                        </Tooltip>
                      ) : null}
                    </div>
                  )}
                </div>
              )}

              <Text size={3} maxWidth="100%" variant="muted">
                Invoices are sent to
              </Text>
              <Text size={3} maxWidth="100%" variant="muted">
                {user.email}
              </Text>
            </Stack>
          </Stack>
        </Card>
      ) : (
        <Card style={{ backgroundColor: 'white' }}>
          <Stack direction="vertical" gap={4} css={css({ color: 'grays.800' })}>
            <Text size={6} weight="bold">
              Go Pro
            </Text>
            <Stack direction="vertical" gap={1}>
              <Text size={3}>+ Work in private</Text>
              <Text size={3}>+ More file storage</Text>
              <Text size={3}>+ Higher upload limits</Text>
              <Text size={3}>+ Flexible permissions</Text>
            </Stack>
            <Button as="a" href="/pro" marginTop={2}>
              Upgrade to Pro
            </Button>
          </Stack>
        </Card>
      )}
    </Grid>
  );
};
