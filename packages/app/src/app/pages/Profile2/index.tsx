import React from 'react';
import {
  ThemeProvider,
  Stack,
  Grid,
  Column,
  Text,
  Stats,
  Link,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOvermind } from 'app/overmind';
import { Header } from './Header';
import { ProfileCard } from './ProfileCard';

export const Profile = props => {
  const { username } = props.match.params;

  const {
    actions: {
      profile: { profileMounted },
    },
    state: {
      profile: { current: user, showcasedSandbox },
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
          height: '100%',
          width: '100vw',
          backgroundColor: 'grays.800',
          color: 'white',
          fontFamily: 'Inter, sans-serif',
        })}
      >
        <Header />

        <Stack marginX={64} gap={8}>
          <div>
            <ProfileCard />
          </div>
          <Stack direction="vertical" gap={10} css={{ flexGrow: 1 }}>
            {showcasedSandbox && (
              <iframe
                src={`https://codesandbox.io/embed/${showcasedSandbox.id}?fontsize=14&hidenavigation=1&theme=dark&view=preview&runonclick=1`}
                style={{
                  width: '100%',
                  height: 360,
                  border: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
                title="React"
                allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
                sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
              />
            )}
            <AllSandboxes />
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

const AllSandboxes = () => {
  const {
    actions: {
      profile: { sandboxesPageChanged },
    },
    state: {
      profile: {
        current: { username },
        isLoadingSandboxes,
        sandboxes: fetchedSandboxes,
      },
    },
  } = useOvermind();

  const [page] = React.useState(0);

  React.useEffect(() => {
    sandboxesPageChanged(page);
  }, [sandboxesPageChanged, page]);

  if (isLoadingSandboxes) return <span>loading</span>;

  if (!fetchedSandboxes[username]) return <span>none</span>;

  const sandboxes = fetchedSandboxes[username][page];

  return (
    <Grid
      rowGap={6}
      columnGap={6}
      css={{
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      }}
    >
      {sandboxes.map(sandbox => (
        <Column key={sandbox.id}>
          <Stack
            as={Link}
            href={sandboxUrl({ id: sandbox.id, alias: sandbox.alias })}
            direction="vertical"
            gap={4}
            css={css({
              border: '1px solid',
              borderColor: 'grays.600',
              borderRadius: 'medium',
              overflow: 'hidden',
              ':hover, :focus, :focus-within': {
                boxShadow: theme => '0 4px 16px 0 ' + theme.colors.grays[900],
              },
            })}
          >
            <div
              css={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '160px',
                backgroundColor: 'grays.600',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
                borderBottom: '1px solid',
                borderColor: 'grays.600',
              })}
              style={{
                backgroundImage: `url(${sandbox.screenshotUrl ||
                  `/api/v1/sandboxes/${sandbox.id}/screenshot.png`})`,
              }}
            />
            <Stack direction="vertical" gap={2} marginX={4} marginBottom={4}>
              <Text>{sandbox.title || sandbox.alias || sandbox.id}</Text>
              <Stats sandbox={sandbox} />
            </Stack>
          </Stack>
        </Column>
      ))}
    </Grid>
  );
};
