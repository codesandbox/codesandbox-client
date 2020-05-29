import { ENTER } from '@codesandbox/common/es/utils/keycodes';
import {
  Button,
  FormField,
  Input,
  Stack,
  TagInput,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React from 'react';

export const EditSummary = ({ setEditing }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged, tagsChanged2 },
    },
    state: {
      editor: {
        currentSandbox: { tags },
      },
      workspace: {
        project: { title, description },
      },
    },
  } = useOvermind();

  const onTitleChange = event => {
    valueChanged({ field: 'title', value: event.target.value });
  };

  const onDescriptionChange = event => {
    valueChanged({ field: 'description', value: event.target.value });
  };

  // Text input elements treat Enter as submit
  // but textarea doesn't, so we need to hijack it.
  const submitOnEnter = event => {
    if (event.keyCode === ENTER && !event.shiftKey) onSubmit(event);
  };

  const [newTags, setNewTags] = React.useState(tags || []);

  const onSubmit = event => {
    event.preventDefault();
    sandboxInfoUpdated();
    tagsChanged2(newTags);
    setEditing(false);
  };

  return (
    <form onSubmit={onSubmit}>
      <Stack
        as="section"
        direction="vertical"
        gap={2}
        paddingX={2}
        marginBottom={6}
      >
        <FormField
          label="Sandbox Name"
          hideLabel
          css={css({ paddingX: 0, width: '100%' })}
        >
          <Input
            value={title}
            onChange={onTitleChange}
            placeholder="Title"
            autoFocus
            type="text"
          />
        </FormField>
        <FormField
          direction="vertical"
          label="Sandbox Description"
          hideLabel
          css={css({ paddingX: 0 })}
        >
          <Textarea
            rows={2}
            placeholder="Description"
            maxLength={280}
            onChange={onDescriptionChange}
            onKeyDown={submitOnEnter}
            value={description}
          />
        </FormField>

        <TagInput value={newTags} onChange={setNewTags} />
      </Stack>

      <Stack justify="space-between" paddingX={2}>
        <Button
          variant="link"
          css={{ flex: 1 }}
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
        <Button type="submit" css={{ flex: 1 }} variant="secondary">
          Save
        </Button>
      </Stack>
    </form>
  );
};
