import React from 'react';
import css from '@styled-system/css';
import { sortBy } from 'lodash-es';
import useInterval from 'use-interval';

import {
  Element,
  Collapsible,
  Stack,
  Avatar,
  Text,
  Label,
  Input,
  List,
  ListItem,
  Select,
  Button,
  Switch,
} from '@codesandbox/components';
import Tooltip from '@codesandbox/common/lib/components/Tooltip';

import { useOvermind } from 'app/overmind';

import {
  AddIcon,
  RemoveIcon,
  UnfollowIcon,
  LiveIcon,
  StopIcon,
  OpenIcon,
  ClassroomIcon,
  FollowIcon,
} from './icons';

const User = ({
  user,
  liveUserId,
  liveRole,
  liveMode,
  followingUserId,
  onFollow,
  onAddEditorClicked,
  onRemoveEditorClicked,
  isOwner,
}) => {
  const currentUser = user.id === liveUserId;

  return (
    <Stack
      justify="space-between"
      align="center"
      css={{
        '.live-actions': { opacity: 0 },
        ':hover': { '.live-actions': { opacity: 1 } },
      }}
    >
      <Stack gap={2} align="center">
        <Avatar user={user} />
        <span>
          <Text size={2} block>
            {user.username}
          </Text>
          <Text size={2} variant="muted" block>
            {liveRole === 'owner' ? 'Owner ' : null}
            {currentUser ? '(you)' : null}
          </Text>
        </span>
      </Stack>

      <Stack align="center" gap={2} className="live-actions">
        {isOwner && liveMode === 'classroom' && (
          <>
            {liveRole === 'spectator' && (
              <Tooltip content="Make editor">
                <AddIcon
                  css={{ cursor: 'pointer' }}
                  onClick={() => onAddEditorClicked({ liveUserId: user.id })}
                />
              </Tooltip>
            )}
            {liveRole === 'editor' && (
              <Tooltip content="Make spectator">
                <RemoveIcon
                  css={{ cursor: 'pointer' }}
                  onClick={() => onRemoveEditorClicked({ liveUserId: user.id })}
                />
              </Tooltip>
            )}
          </>
        )}

        {(liveRole === 'editor' || liveRole === 'owner') && !currentUser && (
          <>
            {followingUserId === user.id ? (
              <Tooltip content="Stop following">
                <UnfollowIcon
                  css={{ cursor: 'pointer' }}
                  onClick={() => onFollow({ liveUserId: null })}
                />
              </Tooltip>
            ) : (
              <Tooltip content="Follow along">
                <FollowIcon
                  css={{ cursor: 'pointer' }}
                  onClick={() => onFollow({ liveUserId: user.id })}
                />
              </Tooltip>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

const Timer = props => {
  const [since, setSince] = React.useState(Date.now() - props.startTime);

  const pad = number => {
    if (`${number}`.length === 1) return `0${number}`;
    return `${number}`;
  };

  useInterval(() => {
    setSince(Date.now() - props.startTime);
  }, 1000);

  const hours = Math.floor(since / 1000 / 60 / 60);
  const minutes = Math.floor((since - hours * 1000 * 60 * 60) / 1000 / 60);
  const seconds = Math.floor(
    (since - hours * 1000 * 60 * 60 - minutes * 1000 * 60) / 1000
  );

  const text = `${hours > 0 ? pad(hours) + ':' : ''}${pad(minutes)}:${pad(
    seconds
  )}`;

  return <Text variant="danger">{text}</Text>;
};

export const LiveNow = () => {
  const {
    actions: {
      live: {
        onSessionCloseClicked,
        onChatEnabledChange,
        onToggleNotificationsHidden,
        onModeChanged,
        onFollow,
        onRemoveEditorClicked,
        onAddEditorClicked,
      },
    },
    state: {
      live: {
        notificationsHidden,
        liveUserId,
        followingUserId,
        isOwner,
        roomInfo: {
          startTime,
          roomId,
          chatEnabled,
          mode,
          users,
          ownerIds,
          editorIds,
        },
      },
    },
  } = useOvermind();

  const owners = users.filter(user => ownerIds.includes(user.id));
  const editors = sortBy(
    users.filter(u => editorIds.includes(u.id) && !ownerIds.includes(u.id)),
    'username'
  );
  const spectators = sortBy(
    users.filter(u => !ownerIds.includes(u.id) && !editorIds.includes(u.id)),
    'username'
  );

  return (
    <>
      <Collapsible title="Live" defaultOpen>
        <Element css={css({ paddingX: 2 })}>
          <Stack justify="space-between" align="center" marginBottom={2}>
            <Text variant="danger">
              <Stack align="center" gap={2}>
                <LiveIcon />
                <span>You&apos;re live!</span>
              </Stack>
            </Text>
            <Timer startTime={startTime} />
          </Stack>

          <Text variant="muted" size={2} block marginBottom={4}>
            Share this link with others to invite them to the session
          </Text>

          <Input
            defaultValue={`https://codesandbox.io/live/${roomId}`}
            marginBottom={2}
          />

          {isOwner && (
            <Button variant="danger" onClick={onSessionCloseClicked}>
              <StopIcon css={css({ marginRight: 2 })} />{' '}
              <span>Stop Session</span>
            </Button>
          )}
        </Element>
      </Collapsible>

      <Collapsible title="Preferences" defaultOpen>
        <List>
          {isOwner && (
            <ListItem justify="space-between">
              <Label htmlFor="chat_enabled">Chat enabled</Label>
              <Switch
                id="chat_enabled"
                on={chatEnabled}
                onChange={() => onChatEnabledChange(!chatEnabled)}
              />
            </ListItem>
          )}
          <ListItem justify="space-between">
            <Label htmlFor="show_notifications">Show notifications</Label>
            <Switch
              id="show_notifications"
              on={!notificationsHidden}
              onChange={() => onToggleNotificationsHidden()}
            />
          </ListItem>
        </List>
      </Collapsible>

      <Collapsible title="Live Mode" defaultOpen>
        <Stack direction="vertical" gap={2} css={css({ paddingX: 2 })}>
          <Select
            icon={mode === 'open' ? OpenIcon : ClassroomIcon}
            value={mode}
            onChange={event => onModeChanged({ mode: event.target.value })}
            disabled={!isOwner}
          >
            <option value="open">Everyone can edit</option>
            <option value="classroom">Classroom mode</option>
          </Select>
          <Text variant="muted" size={2}>
            {mode === 'open'
              ? ''
              : 'In Classroom Mode, you have control over who can edit'}
          </Text>
        </Stack>
      </Collapsible>

      <Collapsible title="Editors" defaultOpen>
        <Element css={css({ paddingX: 2 })}>
          {owners.map(user => (
            <User
              key={user.id}
              user={user}
              liveRole="owner"
              liveMode={mode}
              liveUserId={liveUserId}
              followingUserId={followingUserId}
              onFollow={onFollow}
              onRemoveEditorClicked={onRemoveEditorClicked}
              onAddEditorClicked={onAddEditorClicked}
              isOwner={isOwner}
            />
          ))}
          {editors.map(user => (
            <User
              key={user.id}
              user={user}
              liveRole="editor"
              liveMode={mode}
              liveUserId={liveUserId}
              followingUserId={followingUserId}
              onFollow={onFollow}
              onRemoveEditorClicked={onRemoveEditorClicked}
              onAddEditorClicked={onAddEditorClicked}
              isOwner={isOwner}
            />
          ))}
          {mode === 'open' &&
            spectators.map(user => (
              <User
                key={user.id}
                user={user}
                liveRole="editor"
                liveMode={mode}
                liveUserId={liveUserId}
                followingUserId={followingUserId}
                onFollow={onFollow}
                onRemoveEditorClicked={onRemoveEditorClicked}
                onAddEditorClicked={onAddEditorClicked}
                isOwner={isOwner}
              />
            ))}
        </Element>
      </Collapsible>

      {mode === 'classroom' && (
        <Collapsible title="Viewers" defaultOpen>
          <Element css={css({ paddingX: 2 })}>
            {spectators.map(user => (
              <User
                key={user.id}
                user={user}
                liveRole="spectator"
                liveMode={mode}
                liveUserId={liveUserId}
                followingUserId={followingUserId}
                onFollow={onFollow}
                onRemoveEditorClicked={onRemoveEditorClicked}
                onAddEditorClicked={onAddEditorClicked}
                isOwner={isOwner}
              />
            ))}

            {spectators.length
              ? null
              : 'No other users in session, invite them! '}
          </Element>
        </Collapsible>
      )}
    </>
  );
};
