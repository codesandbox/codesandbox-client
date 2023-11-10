import { Text, Stack, Button, Avatar } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import React, { useState } from 'react';
import { EditAccountForm } from './EditAccountForm';

export const Account = () => {
  const { user } = useAppState();
  const actions = useActions();
  const [editMode, setEditMode] = useState(false);

  if (editMode) {
    return (
      <EditAccountForm
        user={user}
        onSubmit={(userDetails) => {
          actions.preferences.updateAccountDetails(userDetails)
          setEditMode(false);
        }}
        onCancel={() => setEditMode(false)}
      />
    );
  }

  return (
    <Stack direction="vertical" gap={6}>
      <Text block size={4} weight="regular">
        Account
      </Text>

      <Stack gap={2} direction="vertical">
        <Text block size={3} weight="regular">
          Account details
        </Text>

        <Text block size={3} variant="muted">
          Your name, username and profile picture.
        </Text>

        <Stack gap={3} paddingY={2}>
          <Avatar
            user={user}
            css={{
              width: 56,
              height: 56,
              img: { borderRadius: '2px' },
            }}
          />

          <Stack direction="vertical" gap={1}>
            <Text size={3}>{user.username}</Text>
            <Text size={3} variant="muted">
              {user.name}
            </Text>
            <Text size={3} variant="muted">
              {user.email}
            </Text>
          </Stack>
        </Stack>

        <Button autoWidth variant="primary" onClick={() => setEditMode(true)}>
          Edit
        </Button>
      </Stack>

      <Stack gap={2} direction="vertical">
        <Text block size={3} weight="regular">
          Account deletion
        </Text>

        <Text block size={3} variant="muted">
          Irreversibly delete your account and remove all your data from
          CodeSandbox.
        </Text>

        <Button
          onClick={() => {
            if (user.deletionRequested) {
              actions.dashboard.undoRequestAccountClosing();
            } else {
              actions.dashboard.requestAccountClosing();
            }
          }}
          autoWidth
          variant="danger"
        >
          {user.deletionRequested
            ? 'Undo account deletion'
            : 'Request account deletion'}
        </Button>
      </Stack>
    </Stack>
  );
};
