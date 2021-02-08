import { UserQuery } from '@codesandbox/common/lib/types';
import { Button, Stack } from '@codesandbox/components';
import React from 'react';

import { useCodesandboxCommentEditor } from '../hooks/useCodesandboxCommentEditor';

export const EditComment: React.FC<{
  initialValue?: string;
  initialMentions?: { [mentionName: string]: UserQuery };
  initialImages?: {
    [fileName: string]: { src: string; resolution: [number, number] };
  };
  onSave: (
    value: string,
    mentions: { [mentionName: string]: UserQuery },
    images: {
      [fileName: string]: { src: string; resolution: [number, number] };
    }
  ) => void;
  onCancel: () => void;
}> = ({
  initialValue = '',
  initialMentions = {},
  initialImages = {},
  onSave,
  onCancel,
}) => {
  const [elements, value, mentions, images] = useCodesandboxCommentEditor({
    initialValue,
    initialMentions,
    initialImages,
    onSubmit: onSave,
    fixed: false,
    props: {
      autosize: true,
      autoFocus: true,
      style: { lineHeight: 1.2 },
    },
  });

  return (
    <Stack
      as="form"
      onSubmit={event => {
        event.preventDefault();
        onSave(value, mentions, images);
      }}
      css={{
        position: 'relative',
      }}
      direction="vertical"
      gap={2}
    >
      {elements}
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
