import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Element, Text, Stack } from '@codesandbox/components';
import { useAppState, useActions, useEffects } from 'app/overmind';
import { InputText } from 'app/components/dashboard/InputText';
import { InputSelect } from 'app/components/dashboard/InputSelect';
import { StyledButton } from 'app/components/dashboard/Button';

const ROLE_OPTIONS = [
  { value: 'frontend', label: 'Frontend developer' },
  { value: 'backend', label: 'Backend developer' },
  { value: 'fullstack', label: 'Fullstack developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'product-manager', label: 'Product manager' },
  { value: 'educator', label: 'Educator' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
];

const USAGE_OPTIONS = [
  { value: 'freelance-or-client', label: 'Freelance or client work' },
  { value: 'startup', label: 'Startup' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'hobby', label: 'Hobby or fun' },
  { value: 'education', label: 'Education' },
  { value: 'other', label: 'Other' },
];

export const NUOCT22 = 'NUOCT22'; // = new user oct 22

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

  const { pathname } = useLocation();
  const { browser } = useEffects();
  const { validateUsername, finalizeSignUp } = useActions();
  const [newUsername, setNewUsername] = useState(pendingUser?.username || '');
  const [newDisplayName, setNewDisplayName] = useState(pendingUser?.name || '');
  const [loadingUsername, setLoadingUserName] = useState(false);
  const firstName = pendingUser?.name.split(' ')[0];

  if (pathname.includes('/invite')) {
    // Set flag to neither show the create team modal and the
    // what's new modal.
    browser.storage.set(NUOCT22, false);
  } else {
    // Set flag to make sure we show the create team modal and
    // not the what's new modal after signup.
    browser.storage.set(NUOCT22, true);
  }

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
            onChange={e => setNewDisplayName(e.target.value)}
            required
          />

          <InputSelect
            id="role"
            name="role"
            label="What best describes your role?"
            options={ROLE_OPTIONS}
            placeholder="Please select an option"
            required
          />

          <InputSelect
            id="usage"
            name="usage"
            label="How do you plan to use CodeSandbox?"
            options={USAGE_OPTIONS}
            placeholder="Please select an option"
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
