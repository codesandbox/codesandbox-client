import React from 'react';
import { Text, Element, Button, Link, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import track from '@codesandbox/common/lib/utils/analytics';

const NewButton = ({ children, ...props }) => (
  <Button
    variant="secondary"
    css={css({ color: 'sideBar.foreground' })}
    autoWidth
    {...props}
  >
    <Stack gap={2} align="center">
      <svg width={16} height={16} fill="none" viewBox="0 0 16 16">
        <g clipPath="url(#clip0)">
          <path
            fill="currentColor"
            d="M8.4 4.14h-.8v3.6H4v.8h3.6v3.6h.8v-3.6H12v-.8H8.4v-3.6z"
          />
        </g>
        <defs>
          <clipPath id="clip0">
            <path fill="#fff" d="M0 0H16V16H0z" />
          </clipPath>
        </defs>
      </svg>
      <span>{children}</span>
    </Stack>
  </Button>
);

export const CreateProfile = ({ importFile }) => {
  const { createPreferencesProfile } = useActions().preferences;
  const { settingsSync } = useAppState().preferences;

  return (
    <>
      <Element marginBottom={5}>
        <Text variant="muted" size={3}>
          Share your CodeSandbox and editor preferences across multiple devices.
          Save a snapshot of your current preferences as a profile, which you
          can then apply to re-use them when you’re on another device. More info
          can be found in our{' '}
          <Link href="/docs/preferences" css={css({ color: 'blues.500' })}>
            docs
          </Link>
        </Text>
      </Element>
      <Stack gap={5}>
        <NewButton
          disabled={settingsSync.syncing}
          onClick={() => {
            track('Preferences Profiles - Create New Profile');
            createPreferencesProfile();
          }}
        >
          Create new profile
        </NewButton>
        <NewButton onClick={importFile}>Import existing profile</NewButton>
      </Stack>
    </>
  );
};
