import React from 'react';
import { Helmet } from 'react-helmet';
import { useOvermind } from 'app/overmind';
import { Link as RouterLink } from 'react-router-dom';
import {
  Element,
  Stack,
  Text,
  Link,
  Input,
  Button,
  List,
  ListItem,
  Avatar,
} from '@codesandbox/components';
import {
  teamInviteLink,
  dashboard as dashboardUrls,
} from '@codesandbox/common/lib/utils/url-generator';
import { sortBy } from 'lodash-es';
import css from '@styled-system/css';
import { UserSearchInput } from 'app/components/UserSearchInput';
import { Card } from './components';

export const Invite = () => {
  const {
    state: { activeTeam, activeTeamInfo: team },
    actions,
    effects,
  } = useOvermind();

  const inviteLink = team && teamInviteLink(team.inviteToken);

  const [inviteValue, setInviteValue] = React.useState('');
  const [linkCopied, setLinkCopied] = React.useState(false);
  const copyLinkTimeoutRef = React.useRef<number>();

  const [loading, setLoading] = React.useState(false);

  const onSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setInviteValue('');
    await actions.dashboard.inviteToTeam(inviteValue);
    setLoading(false);
  };

  if (!team) return null;

  const copyLink = () => {
    effects.browser.copyToClipboard(inviteLink);
    setLinkCopied(true);

    if (copyLinkTimeoutRef.current) {
      window.clearTimeout(copyLinkTimeoutRef.current);
    }
    copyLinkTimeoutRef.current = window.setTimeout(() => {
      setLinkCopied(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Invite Users - CodeSandbox</title>
      </Helmet>
      <Element
        css={css({
          height: 'calc(100vh - 140px)',
          overflowY: 'scroll',
        })}
      >
        <Stack
          direction="vertical"
          align="center"
          gap={4}
          css={css({
            marginTop: 10,
            transition: 'height ease-in',
            transitionDuration: theme => theme.speeds[2],
          })}
        >
          <Card
            css={css({
              width: 528,
              height: 'auto',
              paddingY: 10,
              paddingX: [6, '64px', '64px'],
            })}
          >
            <Stack direction="vertical" gap={2} marginBottom={10}>
              <Text size={6} weight="bold" align="center">
                Invite members
              </Text>
              <Text size={3} variant="muted" align="center">
                Add the first members to the {team.name} workspace
              </Text>
            </Stack>

            <Stack
              direction="vertical"
              gap={4}
              marginBottom={6}
              css={css({
                paddingBottom: 6,
                borderBottom: '1px solid',
                borderColor: 'grays.600',
              })}
            >
              <Stack gap={2}>
                <Input
                  onFocus={(evt: React.FocusEvent<HTMLInputElement>) => {
                    if (evt.target) {
                      evt.target.select();
                    }
                  }}
                  type="text"
                  value={inviteLink}
                />
                <Button
                  variant="secondary"
                  css={{ width: 88 }}
                  onClick={copyLink}
                >
                  {linkCopied ? 'Link Copied!' : 'Copy Link'}
                </Button>
              </Stack>
              <Stack as="form" onSubmit={onSubmit} gap={2}>
                <UserSearchInput
                  inputValue={inviteValue}
                  onInputValueChange={val => {
                    setInviteValue(val);
                  }}
                />
                <Button
                  type="submit"
                  variant="secondary"
                  css={{ width: 88 }}
                  loading={loading}
                >
                  Send Invite
                </Button>
              </Stack>
            </Stack>

            <List>
              {sortBy(team.users, u => u.username.toLowerCase()).map(user => (
                <ListItem
                  key={user.username}
                  align="center"
                  justify="space-between"
                  css={css({ height: 12, paddingX: 0 })}
                >
                  <Stack gap={2} align="center">
                    <Avatar user={user} />
                    <Text size={3}>{user.username}</Text>
                  </Stack>

                  <Text variant="muted" size={3}>
                    {user.id === team.creatorId ? 'Admin' : 'Member'}
                  </Text>
                </ListItem>
              ))}

              {sortBy(team.invitees, u => u.username.toLowerCase()).map(
                user => (
                  <ListItem
                    key={user.username}
                    align="center"
                    justify="space-between"
                    css={css({ height: 12, paddingX: 0 })}
                  >
                    <Stack gap={2} align="center">
                      <Avatar user={user} />
                      <Text size={3}>{user.username}</Text>
                    </Stack>

                    <Text variant="muted" size={3}>
                      Invited
                    </Text>
                  </ListItem>
                )
              )}
            </List>
          </Card>
          <Link
            as={RouterLink}
            to={dashboardUrls.settings(activeTeam)}
            variant="muted"
            size={3}
            align="center"
          >
            Skip for now
          </Link>
        </Stack>
      </Element>
    </>
  );
};
