import React from 'react';
import { useOvermind } from 'app/overmind';
import { json } from 'overmind';
import { css } from '@styled-system/css';
import {
  Stack,
  FormField,
  Input,
  Textarea,
  Button,
  TagInput,
} from '@codesandbox/components';

export const EditSummary = ({ setEditing }) => {
  const {
    actions: {
      workspace: { sandboxInfoUpdated, valueChanged, tagChanged, tagsChanged },
    },
    state: {
      editor: {
        currentSandbox: { tags },
      },
      workspace: {
        project: { title, description },
        tags: { tagName },
      },
    },
  } = useOvermind();

  const onTitleChange = event => {
    valueChanged({ field: 'title', value: event.target.value });
  };

  const onDescriptionChange = event => {
    valueChanged({ field: 'description', value: event.target.value });
  };

  const [tagsDiff, setTagsDiff] = React.useState({
    newTags: tags,
    removedTags: [],
  });

  const onTagsChanged = (newTags: string[], removedTags: string[]) => {
    setTagsDiff({ newTags, removedTags });
  };

  const onSave = () => {
    sandboxInfoUpdated();
    tagsChanged(tagsDiff);
    setEditing(false);
  };

  return (
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
          value={description}
        />
      </FormField>

      <TagInput
        value={json(tags)}
        onChange={onTagsChanged}
        inputValue={tagName}
        onChangeInput={tagChanged}
      />

      <Stack>
        <Button variant="link" onClick={() => setEditing(false)}>
          Cancel
        </Button>
        <Button variant="secondary" onClick={onSave}>
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
