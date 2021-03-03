import {
  Button,
  Collapsible,
  Element,
  Input,
  Label,
  List,
  ListAction,
  Select,
  Stack,
  Switch,
  Text,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { sortBy } from 'lodash-es';
import React, { FunctionComponent } from 'react';

import { useAppState, useActions } from 'app/overmind';

import { ClassroomIcon, LiveIcon, OpenIcon, StopIcon } from '../icons';

import { Timer } from './Timer';
import { User } from './User';

export const LiveNow: FunctionComponent = () => {
  const {
    onChatEnabledToggle,
    onModeChanged,
    onSessionCloseClicked,
    onToggleNotificationsHidden,
  } = useActions().live;
  const {
    isOwner,
    notificationsHidden,
    reconnecting,
    roomInfo: { chatEnabled, editorIds, mode, ownerIds, roomId, users },
  } = useAppState().live;

  const owners = users.filter(({ id }) => ownerIds.includes(id));
  const editors = sortBy(
    users.filter(({ id }) => editorIds.includes(id) && !ownerIds.includes(id)),
    'username'
  );
  const spectators = sortBy(
    users.filter(({ id }) => !ownerIds.includes(id) && !editorIds.includes(id)),
    'username'
  );

  return (
    <>
      <Collapsible defaultOpen title="Live">
        <Element paddingX={2}>
          <Stack align="center" justify="space-between" marginBottom={2}>
            <Text variant="danger">
              <Stack align="center" gap={2}>
                {reconnecting ? (
                  'Reconnecting...'
                ) : (
                  <>
                    <LiveIcon />

                    <span>You&apos;re live!</span>
                  </>
                )}
              </Stack>
            </Text>

            <Timer />
          </Stack>

          <Text block marginBottom={4} variant="muted">
            Share this link with others to invite them to the session
          </Text>

          <Input
            defaultValue={`https://codesandbox.io/live/${roomId}`}
            onFocus={({ target }) => target.select()}
            marginBottom={2}
            readOnly
          />

          {isOwner && (
            <Button onClick={onSessionCloseClicked} variant="danger">
              <StopIcon css={css({ marginRight: 2 })} />

              <span>Stop Session</span>
            </Button>
          )}
        </Element>
      </Collapsible>

      <Collapsible title="Preferences" defaultOpen>
        <List>
          {isOwner && (
            <ListAction
              justify="space-between"
              onClick={() => onChatEnabledToggle()}
            >
              <Label htmlFor="chat_enabled">Chat enabled</Label>
              <Switch
                id="chat_enabled"
                on={chatEnabled}
                onChange={() => onChatEnabledToggle()}
              />
            </ListAction>
          )}
          <ListAction
            justify="space-between"
            onClick={() => onToggleNotificationsHidden()}
          >
            <Label htmlFor="show_notifications">Show notifications</Label>

            <Switch
              id="show_notifications"
              on={!notificationsHidden}
              onChange={() => onToggleNotificationsHidden()}
            />
          </ListAction>
        </List>
      </Collapsible>

      <Collapsible title="Live Mode" defaultOpen>
        <Stack direction="vertical" gap={2} paddingX={2}>
          <Select
            disabled={!isOwner}
            icon={mode === 'open' ? OpenIcon : ClassroomIcon}
            value={mode}
            onChange={({ target: { value } }) => onModeChanged(value)}
          >
            <option value="open">Everyone can edit</option>

            <option value="classroom">Classroom mode</option>
          </Select>

          <Text size={2} variant="muted">
            {mode === 'open'
              ? ''
              : 'In Classroom Mode, you have control over who can edit'}
          </Text>
        </Stack>
      </Collapsible>

      <Collapsible defaultOpen title="Editors">
        <Stack direction="vertical" gap={2} paddingX={2}>
          {owners.map(user => (
            <User key={user.id} liveRole="owner" user={user} />
          ))}

          {editors.map(user => (
            <User key={user.id} liveRole="editor" user={user} />
          ))}

          {mode === 'open' &&
            spectators.map(user => (
              <User key={user.id} liveRole="editor" user={user} />
            ))}
        </Stack>
      </Collapsible>

      {mode === 'classroom' && (
        <Collapsible defaultOpen title="Viewers">
          <Stack direction="vertical" gap={2} paddingX={2}>
            {spectators.map(user => (
              <User key={user.id} liveRole="spectator" user={user} />
            ))}

            {spectators.length > 0
              ? null
              : 'No other users in session, invite them! '}
          </Stack>
        </Collapsible>
      )}
    </>
  );
};
