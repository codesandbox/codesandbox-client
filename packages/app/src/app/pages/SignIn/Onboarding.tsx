import React, { useState } from 'react';
import { Element, Text, Stack } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { InputText } from 'app/components/dashboard/InputText';
import { InputSelect } from 'app/components/dashboard/InputSelect';
import { StyledButton } from 'app/components/dashboard/Button';
import track from '@codesandbox/common/lib/utils/analytics';

const ROLE_OPTIONS = [
  { value: 'frontend', label: 'Front-End Developer' },
  { value: 'backend', label: 'Back-End Developer' },
  { value: 'fullstack', label: 'Full-Stack Developer' },
  { value: 'lead-dev', label: 'Lead Developer' },
  { value: 'engineering-manager', label: 'Engineering Manager' },
  { value: 'designer', label: 'Designer' },
  { value: 'product-manager', label: 'Product Manager' },
  { value: 'educator', label: 'Educator' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

const USAGE_OPTIONS = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'education', label: 'Education' },
];

export const Onboarding = () => {
  /**
   * 🚧 Utility to debug Trial Onboarding Questions
   */
  const TOQ_DEBUG = window.localStorage.getItem('TOQ_DEBUG') === 'ENABLED';

  // 🚧 Remove
  let pendingUser = useAppState().pendingUser;

  // 🚧 Uncomment
  // const { pendingUser } = useAppState();

  // 🚧 Remove
  if (TOQ_DEBUG) {
    pendingUser = {
      avatarUrl: 'https://avatars.githubusercontent.com/u/7533849?v=4',
      username: 'tristandubbeld',
      name: 'Tristan Dubbeld',
      id: 'id',
      valid: true,
    };
  }

  const { validateUsername, finalizeSignUp } = useActions();
  const [newUsername, setNewUsername] = useState(pendingUser?.username || '');
  const [newDisplayName, setNewDisplayName] = useState(pendingUser?.name || '');
  const [role, setRole] = useState('');
  const [usage, setUsage] = useState('');
  const [loadingUsername, setLoadingUserName] = useState(false);
  const firstName = (pendingUser?.name || '').split(' ')[0];

  return (
    <Stack
      direction="vertical"
      gap={4}
      css={{
        width: '100%',
        maxWidth: '370px',
        alignSelf: 'center',
        paddingBottom: '24px',
      }}
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
          track('Create Account - Finalize SignUp', {
            codesandbox: 'V1',
            event_source: 'UI',
          });
          finalizeSignUp({
            username: newUsername,
            name: newDisplayName,
            role,
            usage,
          });
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
            onChange={e => {
              track('Create Account - Set Username', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              setNewUsername(e.target.value);
            }}
            isInvalid={pendingUser.valid === false}
            aria-invalid={!pendingUser.valid ? true : undefined}
            aria-describedby={!pendingUser.valid ? 'user-error' : undefined}
            required
          />

          {!pendingUser.valid ? (
            <Text size={3} variant="danger" id="user-error">
              Sorry, that username is already taken.
            </Text>
          ) : null}

          <InputText
            id="displayname"
            name="displayname"
            label="Display name"
            value={newDisplayName}
            onChange={e => {
              track('Create Account - Set Display Name', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              setNewDisplayName(e.target.value);
            }}
            required
          />

          <InputSelect
            id="role"
            name="role"
            label="What best describes your role?"
            options={ROLE_OPTIONS}
            placeholder="Please select an option"
            value={role}
            onChange={e => {
              track('Create Account - Set Role', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              setRole(e.target.value);
            }}
            required
          />

          <InputSelect
            id="usage"
            name="usage"
            label="How do you plan to use CodeSandbox?"
            options={USAGE_OPTIONS}
            placeholder="Please select an option"
            value={usage}
            onChange={e => {
              track('Create Account - Set Usage', {
                codesandbox: 'V1',
                event_source: 'UI',
              });
              setUsage(e.target.value);
            }}
            required
          />
        </Stack>
        <StyledButton
          type="submit"
          disabled={loadingUsername || !pendingUser.valid}
        >
          {loadingUsername ? 'Checking username...' : 'Create account'}
        </StyledButton>
      </Stack>
    </Stack>
  );
};
