import React, { useEffect } from 'react';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Grid, Element, Stack, Button } from '@codesandbox/components';
import { Header } from '../../../Components/Header';
import { Box } from './components/Box';
import { Link, Text } from './components/Typography';

export const UserSettings = () => {
  const {
    state: { user },
    actions,
  } = useOvermind();

  useEffect(() => {
    actions.dashboard.newDashboardMounted();
  }, [actions.dashboard]);

  if (!user) {
    return <Header title="User Settings" />;
  }

  // @ts-ignore
  const isPro = user.subscription_plan || user.subscription;
  const value = (user.subscription && user.subscription.amount) || 9;

  return (
    <>
      <Header title="User Settings" />
      <Grid
        columnGap={4}
        css={css({
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        })}
      >
        <Box>
          <Stack gap={4} align="flex-start">
            <img src={user.avatarUrl} width="55" alt={user.username} />

            <Element>
              <Text weight="bold" block marginBottom={4} size={6}>
                {user.username}
              </Text>
              <Text>{user.name}</Text>
              <Text>{user.email}</Text>
              <Link href="https://github.com" target="_blank">
                Managed by Github
              </Link>
            </Element>
          </Stack>
        </Box>
        {!isPro ? (
          <>
            <Box title="User Details">
              <Text>Community (Free)</Text>
              <Link href="https://codesandbox.io/pro">Upgrade plan to Pro</Link>
            </Box>

            <Box
              white
              title={
                <>
                  Pro <Text weight="400">($9/Month)</Text>
                </>
              }
            >
              <Text marginBottom={4} white>
                Everything in Community, plus:
                <br /> + Unlimited Private Sandboxes <br />+ Private GitHub
                Repos
              </Text>
              <Button href="https://codesandbox.io/pro" as="a">
                Subscribe to Pro
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box title=" User Details">
              <Text>Pro Plan</Text>
              <Button
                variant="link"
                marginBottom={2}
                css={css({
                  color: 'button.background',
                  padding: 0,
                  width: 'auto',
                  fontSize: 3,
                  height: 'auto',
                  display: 'block',
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
              <Link href="https://codesandbox.io/pro">Downgrade plan</Link>
            </Box>
            <Box title=" Invoice Details">
              <Text>US${value}</Text>
              <Text>Invoice are send to</Text>
              <Text>{user.email}</Text>
            </Box>
          </>
        )}
      </Grid>
    </>
  );
};
