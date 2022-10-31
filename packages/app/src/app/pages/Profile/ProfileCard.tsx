import React from 'react';
import { Profile } from '@codesandbox/common/lib/types';
import { motion } from 'framer-motion';
import { useAppState, useActions } from 'app/overmind';
import { Link as RouterLink } from 'react-router-dom';
import {
  Grid,
  Stack,
  Avatar,
  Text,
  Link,
  Icon,
  IconButton,
  Button,
  Textarea,
  Input,
  Tooltip,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { TeamAvatar } from 'app/components/TeamAvatar';

export const ProfileCard = () => {
  const { updateUserProfile, validateUsernameUpdate } = useActions().profile;
  const {
    user: loggedInUser,
    profile: { current: user },
  } = useAppState();

  const [editing, setEditing] = React.useState(false);
  const [bio, setBio] = React.useState(user.bio || '');
  const [socialLinks, setSocialLinks] = React.useState(user.socialLinks || []);
  const [username, setUsername] = React.useState(user.username);
  const [name, setName] = React.useState(user.name || '');
  const [usernameAvailable, setUsernameAvailable] = React.useState(true);

  const onCancel = () => {
    setUsernameAvailable(true);
    setUsername(user.username);
    setName(user.name || '');
    setBio(user.bio || '');
    setSocialLinks(user.socialLinks);
    setEditing(false);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    updateUserProfile({
      bio,
      socialLinks: socialLinks.filter(item => item),
      username,
      name,
      onCancel,
    });

    setEditing(false);
  };

  const myProfile = loggedInUser?.username === user.username;

  return (
    <Stack
      as={motion.form}
      onSubmit={onSubmit}
      direction="vertical"
      justify="space-between"
      css={css({
        width: '100%',
        minHeight: '320px',
        backgroundColor: 'grays.700',
        borderRadius: 'medium',
        border: '1px solid',
        borderColor: 'grays.600',
        paddingTop: 2,
        paddingBottom: 6,
        marginBottom: 8,
      })}
    >
      <Stack direction="vertical">
        <Stack
          direction="vertical"
          gap={4}
          css={css({
            paddingX: 6,
            paddingY: 6,
            // fix height to avoid jumping
            minHeight: myProfile ? 230 : 'auto',
          })}
        >
          <Stack gap={4} align="center">
            <Avatar
              user={user}
              css={css({
                size: 64,
                img: { borderRadius: 'medium' },
                span: { fontSize: 2, height: 4, lineHeight: '14px' },
              })}
            />
            <Stack direction="vertical">
              <DisplayName name={name} editing={editing} setName={setName} />
              <Username
                username={username}
                editing={editing}
                setUsername={setUsername}
                setUsernameAvailable={setUsernameAvailable}
                validateUsernameUpdate={validateUsernameUpdate}
              />
            </Stack>
          </Stack>

          {!usernameAvailable ? (
            <Text size={3} variant="danger">
              Sorry, that username is already taken.
            </Text>
          ) : null}

          <Bio bio={bio} editing={editing} setBio={setBio} />

          {editing ? null : (
            <Stack direction="vertical" gap={3}>
              <Stack gap={2} align="center">
                <Icon name="box" />
                <Link as={RouterLink} to={`/u/${user.username}`} size={3}>
                  {user.sandboxCount + user.templateCount} Sandboxes
                </Link>
              </Stack>
              <Stack gap={2} align="center">
                <Icon name="heart" />
                <Link as={RouterLink} to={`/u/${user.username}/likes`} size={3}>
                  {user.givenLikeCount} Liked sandboxes
                </Link>
              </Stack>
            </Stack>
          )}
        </Stack>
        {user.teams.length > 1 ? (
          <Stack
            direction="vertical"
            gap={4}
            css={css({
              paddingX: 6,
              paddingY: 4,
              borderTop: '1px solid',
              borderColor: 'grays.600',
            })}
          >
            <Text size={2} weight="bold">
              Teams
            </Text>
            <Grid
              css={{ gridTemplateColumns: 'repeat(auto-fill, 26px)', gap: 12 }}
            >
              {user.teams
                .slice(1) // first one is always personal account
                .sort((team1, team2) =>
                  team1.avatarUrl && !team2.avatarUrl ? -1 : 1
                )
                .map(team => (
                  <Tooltip key={team.id} label={team.name}>
                    <span>
                      <TeamAvatar name={team.name} avatar={team.avatarUrl} />
                    </span>
                  </Tooltip>
                ))}
            </Grid>
          </Stack>
        ) : null}

        {socialLinks.length || editing ? (
          <Stack
            direction="vertical"
            gap={4}
            css={css({
              width: '100%',
              paddingX: 6,
              paddingY: 4,
              marginBottom: 4,
              borderTop: '1px solid',
              borderColor: 'grays.600',
            })}
          >
            <Text size={2} weight="bold">
              Other places
            </Text>
            <SocialLinks
              socialLinks={socialLinks}
              githubUsername={user.githubUsername}
              editing={editing}
              setSocialLinks={setSocialLinks}
            />
          </Stack>
        ) : null}
      </Stack>

      {myProfile ? (
        <Stack
          direction="vertical"
          gap={1}
          marginX={6}
          marginTop={
            editing ? 0 : socialLinks.length * 10 + 42 // precise measurement to keep CTA in the same spot
          }
        >
          {editing ? (
            <>
              <Button type="submit" disabled={!usernameAvailable}>
                Save changes
              </Button>
              <Button variant="link" type="button" onClick={onCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="secondary"
              type="button"
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                event.preventDefault();
                setEditing(true);
              }}
            >
              Edit Profile
            </Button>
          )}
        </Stack>
      ) : null}
    </Stack>
  );
};

const Bio: React.FC<{
  bio: Profile['bio'];
  setBio: (bio: Profile['bio']) => void;
  editing: boolean;
}> = ({ bio, editing, setBio }) =>
  editing ? (
    <Textarea
      autosize
      maxLength={160}
      defaultValue={bio}
      onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
        setBio(event.target.value)
      }
    />
  ) : (
    <Text size={3} variant="muted" css={{ whiteSpace: 'pre-wrap' }}>
      {bio}
    </Text>
  );

const SocialLinks: React.FC<{
  socialLinks: Profile['socialLinks'];
  githubUsername: Profile['githubUsername'];
  editing: boolean;
  setSocialLinks: (socialLinks: Profile['socialLinks']) => void;
}> = ({ socialLinks, githubUsername, setSocialLinks, editing }) => (
  <Stack direction="vertical" gap={4} css={{ width: '100%' }}>
    {editing ? (
      <Stack direction="vertical" gap={4} key={socialLinks.length}>
        {socialLinks.map((link, index) => (
          <Stack
            gap={1}
            css={{ ':hover button, :focus-within button': { opacity: 1 } }}
          >
            <Input
              // eslint-disable-next-line
              key={index}
              defaultValue={link}
              autoFocus
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const links = [...socialLinks];
                links[index] = event.target.value;
                setSocialLinks(links);
              }}
            />
            <IconButton
              title="Remove link"
              name="cross"
              size={10}
              css={{ opacity: 0 }}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                const links = socialLinks.filter(
                  (nestedLink, nestedIndex) => nestedIndex !== index
                );
                setSocialLinks(links);
              }}
            />
          </Stack>
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
        {githubUsername && (
          <Stack
            as={Link}
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            gap={2}
            align="center"
          >
            <Icon
              name={getIconNameFromUrl(`https://github.com/${githubUsername}`)}
            />
            <Text size={3}>
              {getPrettyLinkFromUrl(`https://github.com/${githubUsername}`)}
            </Text>
          </Stack>
        )}
        {socialLinks.map(link => (
          <Stack
            as={Link}
            href={link}
            target="_blank"
            gap={2}
            align="center"
            key={link}
          >
            <Icon name={getIconNameFromUrl(link)} />
            <Text size={3}>{getPrettyLinkFromUrl(link)}</Text>
          </Stack>
        ))}
      </>
    )}
  </Stack>
);

const Username: React.FC<{
  username: Profile['username'];
  editing: boolean;
  setUsername: (username: Profile['username']) => void;
  setUsernameAvailable: (boolean) => void;
  validateUsernameUpdate: (string) => void;
}> = ({
  username,
  editing,
  setUsername,
  setUsernameAvailable,
  validateUsernameUpdate,
}) => (
  <Stack direction="vertical" gap={4} css={{ width: '100%' }}>
    {editing ? (
      <Input
        onBlur={async event => {
          const valid = await validateUsernameUpdate(event.target.value);
          setUsernameAvailable(valid);
        }}
        defaultValue={username}
        onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
          setUsername(event.target.value);
        }}
      />
    ) : (
      <Text size={3} variant="muted">
        {username}
      </Text>
    )}
  </Stack>
);

const DisplayName: React.FC<{
  name: Profile['name'];
  editing: boolean;
  setName: (name: Profile['name']) => void;
}> = ({ name, editing, setName }) => (
  <Stack direction="vertical" gap={4} css={{ width: '100%' }}>
    {editing ? (
      <Input
        defaultValue={name}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setName(event.target.value)
        }
      />
    ) : (
      <Text size={5} weight="bold">
        {name}
      </Text>
    )}
  </Stack>
);

const getIconNameFromUrl = (url: string) => {
  if (url.includes('github.com')) return 'github';
  if (url.includes('twitter.com')) return 'twitter';
  return 'globe';
};

const getPrettyLinkFromUrl = (url: string) =>
  url
    .replace('https://', '')
    .replace('http://', '')
    .replace('twitter.com/', '')
    .replace('github.com/', '');
