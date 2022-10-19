import React, { useState } from 'react';
import { Element, Text, Stack } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { InputText } from 'app/components/dashboard/InputText';
import { InputSelect } from 'app/components/dashboard/InputSelect';
import { Button } from 'app/components/dashboard/Button';

const roleOptions = [
  { value: 'frontend', label: 'Frontend developer' },
  { value: 'backend', label: 'Backend developer' },
  { value: 'fullstack', label: 'Fullstack developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'product-manager', label: 'Product manager' },
  { value: 'educator', label: 'Educator' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

const usageOptions = [
  { value: 'freelance-or-client', label: 'Freelance or client work' },
  { value: 'startup', label: 'Startup' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'hobby', label: 'Hobby or fun' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export const UserNameSelection = () => {
  const { pendingUser } = useAppState();
  const { validateUsername, finalizeSignUp } = useActions();
  const [newUsername, setNewUsername] = useState(pendingUser?.username || '');
  const [newDisplayName, setNewDisplayName] = useState(pendingUser?.name || '');
  const [loadingUsername, setLoadingUserName] = useState(false);
  const firstName = pendingUser?.name.split(' ')[0];

  return (
    <Stack
      direction="vertical"
      gap={4}
      css={{ width: '100%', maxWidth: '370px' }}
    >
      <Stack direction="vertical" gap={6} align="center">
        <Element
          as="img"
          css={{
            width: 64,
            height: 64,
            borderRadius: '100%',
          }}
          alt={pendingUser.username}
          src={pendingUser.avatarUrl}
        />
        <Text
          as="h1"
          size={32}
          weight="500"
          align="center"
          css={{
            margin: 0,
            color: '#ffffff',
            fontFamily: 'Everett, sans-serif',
            lineHeight: '42px',
            letterSpacing: '-0.01em',
          }}
        >
          Welcome{firstName ? `, ${firstName}` : null}
        </Text>
      </Stack>
      <Stack
        as="form"
        direction="vertical"
        gap={6}
        onSubmit={e => {
          e.preventDefault();
          finalizeSignUp({ username: newUsername, name: newDisplayName });
        }}
      >
        <Stack direction="vertical" gap={4}>
          <InputText
            id="username"
            name="username"
            label="Username"
            // TODO: Instead of onBlur we can debounce onchange
            onBlur={async e => {
              setLoadingUserName(true);
              await validateUsername(e.target.value);
              setLoadingUserName(false);
            }}
            value={newUsername}
            onChange={e => setNewUsername(e.target.value)}
          />

          <InputText
            id="displayname"
            name="displayname"
            label="Display name"
            value={newDisplayName}
            onChange={e => setNewDisplayName(e.target.value)}
          />

          <InputSelect
            id="role"
            name="role"
            label="What best describes your role?"
            options={roleOptions}
          />

          <InputSelect
            id="usage"
            name="usage"
            label="How do you plan to use CodeSandbox?"
            options={usageOptions}
          />

          {/* TODO: Move this to the username InputText */}
          {!pendingUser.valid ? (
            <Text size={3} variant="danger">
              Sorry, that username is already taken.
            </Text>
          ) : null}
        </Stack>
        <Button type="submit" disabled={loadingUsername || !pendingUser.valid}>
          {loadingUsername ? 'Checking username...' : 'Create account'}
        </Button>
      </Stack>
    </Stack>
  );
};
