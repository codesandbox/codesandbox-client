import React from 'react';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import {
  Stack,
  FormField,
  Input,
  Textarea,
  Button,
  TagInput,
} from '@codesandbox/components';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';

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

      <Stack paddingX={2}>
        <Button variant="link" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        <Button type="submit" variant="secondary">
          Save
        </Button>
      </Stack>
    </form>
  );
};
