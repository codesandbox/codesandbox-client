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

import { useOvermind } from 'app/overmind';

type Props = {
  setEditing: (editing: boolean) => void;
};

const readDataURL = (file: File): Promise<string | ArrayBuffer> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });

type parsedFiles = { [k: string]: { dataURI: string; type: string } };
const getFile = async (file: File): Promise<parsedFiles> => {
  const returnedFiles = {};
  const dataURI = await readDataURL(file);
  // @ts-ignore
  const fileName = file.path || file.name;

  returnedFiles[`thumbnail.${fileName.split('.').pop()}`] = {
    dataURI,
    type: file.type,
  };

  return returnedFiles;
};

export const EditSummary: FunctionComponent<Props> = ({ setEditing }) => {
  const {
    actions: {
      files: { thumbnailToBeCropped },
      workspace: { sandboxInfoUpdated, valueChanged, tagsChanged2 },
    },
    state: {
      editor: {
        currentSandbox: { tags, modules },
      },
      workspace: {
        uploadingThumb,
        project: { title, description },
      },
    },
  } = useOvermind();
  const [newTags, setNewTags] = useState(tags || []);
  const thumbnailExists = modules.find(m => m.path.includes('/thumbnail.'));
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

  const uploadThumbnail = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'image/x-png,image/gif,image/jpeg');
    fileSelector.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const file = await getFile(target.files[0]);

      thumbnailToBeCropped({
        file,
      });
    };

    fileSelector.click();
  };

  const getText = () => {
    if (uploadingThumb) {
      return 'Uploading...';
    }
    if (thumbnailExists) {
      return 'Replace Cover';
    }
    return '+ Add cover';
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
        <button
          onClick={uploadThumbnail}
          type="button"
          css={css({
            marginTop: 6,
            background: 'transparent',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'sideBar.border',
            color: 'mutedForeground',
            height: 54,
            padding: 0,
            outline: 'none',
            cursor: 'pointer',
          })}
          disabled={uploadingThumb}
        >
          {getText()}
        </button>
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
