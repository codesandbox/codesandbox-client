import React from 'react';
import { Button, Input, Text, Stack } from '@codesandbox/components';
import { CurrentUser } from '@codesandbox/common/lib/types';

export interface EditAccountFormProps {
  user: CurrentUser;
  onSubmit: (userDetails: { username: string; name: string }) => void;
  onCancel: () => void;
}

export const EditAccountForm: React.FC<EditAccountFormProps> = ({
  user,
  onSubmit,
  onCancel,
}) => {
  const [username, setUsername] = React.useState(user.username);
  const [name, setName] = React.useState(user.name);

  return (
    <Stack
      as="form"
      direction="vertical"
      gap={6}
      onSubmit={e => {
        e.preventDefault();
        onSubmit({ username, name });
      }}
    >
      <Text block size={4} weight="regular">
        Edit account details
      </Text>

      <Stack gap={2} direction="vertical">
        <Text block size={3} variant="muted" as="label">
          Username
        </Text>
        <Input
          placeholder="Username"
          defaultValue={user.username}
          onChange={e => setUsername(e.target.value)}
        />
      </Stack>

      <Stack gap={2} direction="vertical">
        <Text block size={3} variant="muted" as="label">
          Full name
        </Text>
        <Input
          placeholder="Full name"
          defaultValue={user.name}
          onChange={e => setName(e.target.value)}
        />
      </Stack>

      <Stack gap={2}>
        <Button autoWidth variant="primary" type="submit">
          Save
        </Button>
        <Button autoWidth onClick={onCancel} variant="secondary" type="button">
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};
