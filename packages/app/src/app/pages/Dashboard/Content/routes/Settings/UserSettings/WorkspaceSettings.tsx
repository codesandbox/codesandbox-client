import {
  Avatar,
  Button,
  Grid,
  Stack,
  Text,
  Tooltip,
} from '@codesandbox/components';
import {
  github as GitHubIcon,
  GoogleIcon,
} from '@codesandbox/components/lib/components/Icon/icons';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { useEffect } from 'react';

import { Header } from '../../../../Components/Header';
import { Card } from '../components';

export const WorkspaceSettings = () => {
  const {
    state: { user, activeTeam, activeTeamInfo },
    actions,
  } = useOvermind();

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
              <Text size={6} weight="bold" maxWidth="100%">
                {user.username}
              </Text>
              <Text size={3} maxWidth="100%">
                {user.name}
              </Text>
              <Text size={3} maxWidth="100%">
                {user.email}
              </Text>
              <Button
                variant="link"
                css={css({
                  width: 'fit-content',
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
            <Text size={3} maxWidth="100%">
              {activeSubscription ? 'Personal Pro' : 'Community Plan'}
            </Text>
            {activeSubscription ? (
              <>
                <Button
                  variant="link"
                  css={css({
                    width: 'fit-content',
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
                  Change payment info
                </Button>
                <Button
                  variant="link"
                  css={css({
                    width: 'fit-content',
                    height: 'auto',
                    fontSize: 3,
                    color: 'button.background',
                    padding: 0,
                  })}
                  onClick={() => {
                    actions.patron.cancelSubscriptionClicked();
                  }}
                >
                  Downgrade plan
                </Button>
              </>
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
                  {activeTeamInfo?.subscription.origin === 'PATRON' ? (
                    <Text size={3} variant="muted">
                      USD {user?.subscription.amount}{' '}
                    </Text>
                  ) : (
                    <Text size={3} variant="muted">
                      {activeTeamInfo?.subscription.currency}{' '}
                      {(
                        (activeTeamInfo.subscription.quantity *
                          activeTeamInfo.subscription.unitPrice) /
                        100
                      ).toFixed(2)}{' '}
                      <Text css={{ textTransform: 'capitalize' }}>
                        {activeTeamInfo.subscription.billingInterval.toLowerCase()}
                      </Text>
                    </Text>
                  )}
                </div>
              )}

              <Text size={3} maxWidth="100%">
                Invoices are sent to
              </Text>
              <Text size={3} maxWidth="100%">
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
              <Text size={3}>Community, plus:</Text>
              <Text size={3}>+ Work in private</Text>
              <Text size={3}>+ More file storage</Text>
              <Text size={3}>+ Higher upload limits</Text>
              <Text size={3}>+ Flexible permissions</Text>
            </Stack>
            <Button as="a" href="/pro" target="_blank" marginTop={2}>
              Upgrade to Pro
            </Button>
          </Stack>
        </Card>
      )}
    </Grid>
  );
};
