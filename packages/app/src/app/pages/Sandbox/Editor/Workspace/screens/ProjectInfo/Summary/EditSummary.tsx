import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Button,
  FormField,
  Input,
  Stack,
  TagInput,
  Textarea,
} from '@codesandbox/components';
import css from '@styled-system/css';
import React, {
  ChangeEvent,
  FormEvent,
  FunctionComponent,
  KeyboardEvent,
  useState,
} from 'react';

import { useAppState, useActions } from 'app/overmind';
import { ThumbnailEdit } from './ThumbnailEdit';

type Props = {
  setEditing: (editing: boolean) => void;
};

export const EditSummary: FunctionComponent<Props> = ({ setEditing }) => {
  const {
    editor: {
      currentSandbox: { tags },
    },
    workspace: {
      project: { title, description },
    },
  } = useAppState();
  const {
    sandboxInfoUpdated,
    valueChanged,
    tagsChanged2,
  } = useActions().workspace;
  const [newTags, setNewTags] = useState(tags || []);

  const onTitleChange = ({ target }: ChangeEvent<HTMLInputElement>) =>
    valueChanged({ field: 'title', value: target.value });
  const onDescriptionChange = ({ target }: ChangeEvent<HTMLTextAreaElement>) =>
    valueChanged({ field: 'description', value: target.value });

  // Text input elements treat Enter as submit
  // but textarea doesn't, so we need to hijack it.
  const submitOnEnter = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === ENTER && !event.shiftKey) {
      onSubmit(event);
    }
  };

  const onSubmit = (event: FormEvent) => {
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
        marginBottom={6}
        paddingX={2}
      >
        <FormField
          css={css({ paddingX: 0, width: '100%' })}
          hideLabel
          label="Sandbox Name"
        >
          <Input
            autoFocus
            onChange={onTitleChange}
            placeholder="Title"
            type="text"
            value={title}
          />
        </FormField>

        <FormField
          css={css({ paddingX: 0 })}
          direction="vertical"
          hideLabel
          label="Sandbox Description"
        >
          <Textarea
            maxLength={280}
            onChange={onDescriptionChange}
            onKeyDown={submitOnEnter}
            placeholder="Description"
            rows={2}
            value={description}
          />
        </FormField>

        <TagInput onChange={setNewTags} value={newTags} />
        <ThumbnailEdit />
      </Stack>
      <Stack justify="space-between" paddingX={2}>
        <Button
          css={{ flex: 1 }}
          onClick={() => setEditing(false)}
          variant="link"
        >
          Cancel
        </Button>

        <Button css={{ flex: 1 }} type="submit" variant="secondary">
          Save
        </Button>
      </Stack>
    </form>
  );
};
