import React from 'react';
import { Stack, Textarea, Button } from '@codesandbox/components';
import { CommentFragment } from 'app/graphql/types';

export const EditComment: React.FC<{
  comment: CommentFragment;
  onSave: (value: string) => void;
  onCancel: () => void;
}> = ({ comment, onSave, onCancel }) => {
  const [value, setValue] = React.useState(comment.content);

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
