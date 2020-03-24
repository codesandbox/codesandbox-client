import React from 'react';
import { Stack, Textarea, Button } from '@codesandbox/components';

export const EditComment: React.FC<{
  initialValue?: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}> = ({ initialValue = '', onSave, onCancel }) => {
  const [value, setValue] = React.useState(initialValue);

  return (
    <Stack
      as="form"
      onSubmit={event => {
        event.preventDefault();
        onSave(value);
      }}
      direction="vertical"
      gap={2}
    >
      <Textarea
        autosize
        autoFocus
        value={value}
        onChange={event => setValue(event.target.value)}
      />
      <Stack justify="flex-end">
        <Button
          type="button"
          variant="link"
          css={{ width: 100 }}
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" variant="secondary" css={{ width: 100 }}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
