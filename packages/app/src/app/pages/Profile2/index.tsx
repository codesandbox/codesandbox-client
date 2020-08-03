import React from 'react';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import {
  ThemeProvider,
  Stack,
  Avatar,
  Link,
  Text,
  Icon,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';

export const Profile = props => {
  const { username } = props.match.params;
  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user },
    },
  } = useOvermind();

  React.useEffect(() => {
    profileMounted(username);
  }, [profileMounted, username]);

  if (!user) return null;

  return (
    <ThemeProvider>
      <Stack
        direction="vertical"
        gap={104}
        css={css({
          height: '100vh',
          width: '100vw',
          backgroundColor: 'grays.900',
          color: 'white',
        })}
      >
        <Stack
          as="header"
          justify="space-between"
          align="center"
          paddingX={4}
          css={css({
            boxSizing: 'border-box',
            fontFamily: 'Inter, sans-serif',
            height: 12,
            backgroundColor: 'titleBar.activeBackground',
            color: 'titleBar.activeForeground',
            borderBottom: '1px solid',
            borderColor: 'titleBar.border',
          })}
        >
          <Link
            href="/?from-app=1"
            css={css({ display: ['none', 'none', 'block'] })}
          >
            <LogoIcon
              style={{
                marginLeft: -6, // Logo positioning tweak
              }}
              height={24}
            />
          </Link>
        </Stack>
        <Stack marginX={64}>
          <Stack
            direction="vertical"
            css={css({
              width: '320px',
              backgroundColor: 'grays.700',
              borderRadius: 'medium',
              border: '1px solid',
              borderColor: 'grays.600',
              paddingY: 2,
            })}
          >
            <Stack
              direction="vertical"
              gap={4}
              css={css({
                paddingX: 6,
                paddingY: 6,
              })}
            >
              <Stack gap={4} align="center">
                <Avatar
                  user={user}
                  css={css({
                    size: 64,
                    img: { borderRadius: 'medium' },
                    span: { fontSize: 3, height: 4, lineHeight: '16px' },
                  })}
                />
                <Stack direction="vertical">
                  <Text size={5} weight="bold">
                    {user.name}
                  </Text>
                  <Text size={3} variant="muted">
                    {user.username}
                  </Text>
                </Stack>
              </Stack>

              <Text size={3} variant="muted">
                {user.bio ||
                  (user.username === 'CompuIves' &&
                    'Creator of @codesandbox and now working full-time on it! I like cookies')}
              </Text>
              <Stack direction="vertical" gap={3}>
                <Stack gap={2} align="center">
                  <Icon name="box" />
                  <Text size={3}>{user.sandboxCount} Sandboxes</Text>
                </Stack>
                <Stack gap={2} align="center">
                  <Icon name="heart" />
                  <Text size={3}>{user.receivedLikeCount} Likes</Text>
                </Stack>
              </Stack>
            </Stack>
            {/* <Stack
              gap={4}
              css={css({
                paddingX: 6,
                paddingY: 4,
                borderTop: '1px solid',
                borderColor: 'grays.600',
              })}
            >
              <Text size={2} weight="bold">
                Team
              </Text>
            </Stack>
            <Stack
              gap={4}
              css={css({
                paddingX: 6,
                paddingY: 4,
                borderTop: '1px solid',
                borderColor: 'grays.600',
              })}
            >
              <Text size={2} weight="bold">
                Other places
              </Text>
            </Stack> */}
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};
