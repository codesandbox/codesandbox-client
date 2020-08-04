import React from 'react';
import { motion } from 'framer-motion';
import LogoIcon from '@codesandbox/common/lib/components/Logo';
import {
  ThemeProvider,
  Stack,
  Avatar,
  Link,
  Text,
  Icon,
  Button,
  Textarea,
  Input,
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
        align="center"
        gap={104}
        css={css({
          height: '100vh',
          width: '100vw',
          backgroundColor: 'grays.900',
          color: 'white',
        })}
      >
        <Header />

        <ProfileCard />
      </Stack>
    </ThemeProvider>
  );
};

const Header = () => (
  <Stack
    as="header"
    justify="space-between"
    align="center"
    paddingX={4}
    css={css({
      width: '100%',
      boxSizing: 'border-box',
      fontFamily: 'Inter, sans-serif',
      height: 12,
      backgroundColor: 'titleBar.activeBackground',
      color: 'titleBar.activeForeground',
      borderBottom: '1px solid',
      borderColor: 'titleBar.border',
    })}
  >
    <Link href="/?from-app=1" css={css({ display: ['none', 'none', 'block'] })}>
      <LogoIcon
        style={{
          marginLeft: -6, // Logo positioning tweak
        }}
        height={24}
      />
    </Link>
  </Stack>
);

const ProfileCard = () => {
  const {
    actions: {
      profile: { updateUserProfile },
    },
    state: {
      profile: { current: user },
    },
  } = useOvermind();

  const [editing, setEditing] = React.useState(false);
  const [bio, setBio] = React.useState(user.bio || '');
  const [socialLinks, setSocialLinks] = React.useState(user.socialLinks || []);

  const onSubmit = event => {
    event.preventDefault();
    updateUserProfile({ bio, socialLinks: socialLinks.filter(item => item) });

    setSocialLinks(socialLinks.filter(item => item));
    setEditing(false);
  };

  const onCancel = () => {
    setBio(user.bio);
    setSocialLinks(user.socialLinks);
    setEditing(false);
  };

  return (
    <Stack as={motion.div} marginX={64}>
      <Stack
        direction="vertical"
        justify="space-between"
        css={css({
          width: '320px',
          minHeight: '320px',
          backgroundColor: 'grays.700',
          borderRadius: 'medium',
          border: '1px solid',
          borderColor: 'grays.600',
          paddingTop: 2,
          paddingBottom: 6,
        })}
      >
        <Stack direction="vertical">
          <Stack
            direction="vertical"
            gap={4}
            css={css({
              paddingX: 6,
              paddingY: 6,
              height: 230,
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

            <Bio bio={bio} editing={editing} setBio={setBio} />

            {editing ? null : (
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
            )}
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
              </Stack> */}
          <Stack
            css={css({
              paddingX: 6,
              paddingY: 4,
              marginBottom: 4,
              borderTop: '1px solid',
              borderColor: 'grays.600',
            })}
          >
            <Stack direction="vertical" gap={4} css={{ width: '100%' }}>
              <Text size={2} weight="bold">
                Other places
              </Text>
              <SocialLinks
                username={user.username}
                socialLinks={socialLinks}
                editing={editing}
                setSocialLinks={setSocialLinks}
              />
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="vertical" gap={1} marginX={6}>
          {editing ? (
            <>
              <Button onClick={onSubmit}>Save changes</Button>
              <Button variant="link" type="button" onClick={onCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="secondary" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

const Bio = ({ bio, editing, setBio }) => (
  <>
    {editing ? (
      <Textarea
        autosize
        maxLength={280}
        defaultValue={bio}
        onChange={event => setBio(event.target.value)}
      />
    ) : (
      <Text size={3} variant="muted">
        {bio}
      </Text>
    )}
  </>
);

const SocialLinks = ({ username, socialLinks, editing, setSocialLinks }) => (
  <Stack direction="vertical" gap={4} css={{ width: '100%' }}>
    <Stack gap={2} align="center">
      <Icon name="github" />
      <Text size={3}>{username}</Text>
    </Stack>
    {editing ? (
      <Stack
        as="form"
        direction="vertical"
        gap={4}
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        {socialLinks.map((link, index) => (
          <Input
            key={link}
            defaultValue={link}
            autoFocus
            onChange={event => {
              const links = [...socialLinks];
              links[index] = event.target.value;
              setSocialLinks(links);
            }}
          />
        ))}

        <Button
          variant="link"
          css={css({
            fontWeight: 'normal',
            justifyContent: 'start',
            paddingX: 0,
          })}
          onClick={() => setSocialLinks([...socialLinks, 'https://'])}
        >
          + Add website
        </Button>
      </Stack>
    ) : (
      <>
        {socialLinks.map(link => (
          <Stack gap={2} align="center">
            <Icon name={getIconNameFromUrl(link)} />
            <Text size={3}>{getPrettyLinkFromUrl(link)}</Text>
          </Stack>
        ))}
      </>
    )}
  </Stack>
);

const getIconNameFromUrl = url => {
  if (url.includes('github.com')) return 'github';
  if (url.includes('twitter.com')) return 'twitter';
  return 'globe';
};

const getPrettyLinkFromUrl = url =>
  url
    .replace('https://', '')
    .replace('http://', '')
    .replace('twitter.com/', '')
    .replace('gituhb.com/', '');
