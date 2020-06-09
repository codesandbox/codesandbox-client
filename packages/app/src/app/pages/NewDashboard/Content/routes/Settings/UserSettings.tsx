import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';

import {
  Avatar,
  Button,
  Element,
  Grid,
  Stack,
  Text,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';

import { Header } from '../../../Components/Header';
import { Card } from './components';

export const UserSettings = () => {
  const {
    state: { user },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.dashboardMounted();
  }, [actions.dashboard]);

  if (!user) {
    return <Header title="Settings" />;
  }

  // @ts-ignore
  const isPro = user.subscription_plan || user.subscription;
  const value = (user.subscription && user.subscription.amount) || 9;

  return (
    <>
      <Header title="User Settings" />
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
              <Stack direction="vertical" gap={2}>
                <Stack gap={4}>
                  <Avatar user={user} css={css({ size: 14 })} />
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
                    <Link
                      size={3}
                      href={`https://github.com/${user.username}`}
                      target="_blank"
                    >
                      Managed by Github
                    </Link>
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
                    {isPro ? 'Pro Plan' : 'Community Plan'}
                  </Text>
                  {isPro ? (
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
            {isPro ? (
              <Card>
                <Stack direction="vertical" gap={2}>
                  <Stack direction="vertical" gap={2}>
                    <Text size={6} weight="bold" maxWidth="100%">
                      Invoice details
                    </Text>
                    <Text size={3} maxWidth="100%">
                      US${value}
                    </Text>
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
                <Stack direction="vertical" gap={4}>
                  <Text
                    size={6}
                    weight="bold"
                    css={css({ color: 'grays.800' })}
                  >
                    Pro
                  </Text>
                  <Stack direction="vertical" gap={1}>
                    <Text
                      size={3}
                      variant="muted"
                      css={css({ color: 'grays.800' })}
                    >
                      Everything in Community, plus:
                    </Text>
                    <Text
                      size={3}
                      variant="muted"
                      css={css({ color: 'grays.800' })}
                    >
                      + Unlimited Private Sandboxes
                    </Text>
                    <Text
                      size={3}
                      variant="muted"
                      css={css({ color: 'grays.800' })}
                    >
                      + Private GitHub Repos
                    </Text>
                  </Stack>
                  <Button
                    as="a"
                    href="https://airtable.com/shrlgLSJWiX8rYqyG"
                    target="_blank"
                    marginTop={2}
                  >
                    Subscribe to Pro
                  </Button>
                </Stack>
              </Card>
            )}
          </Grid>
        </Stack>
      </Element>
    </>
  );
};
