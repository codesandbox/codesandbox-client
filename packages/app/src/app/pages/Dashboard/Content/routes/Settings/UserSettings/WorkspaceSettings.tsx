import React, { useEffect } from 'react';
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
        <Stack direction="vertical" gap={2}>
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
              <Text size={6} weight="bold" maxWidth="100%" variant="muted">
                {user.username}
              </Text>
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
        </Stack>
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
