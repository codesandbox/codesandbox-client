import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import {
  Button,
  FormField,
  Input,
  Stack,
  TagInput,
  Element,
  Textarea,
  Tooltip,
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
      return (
        <Element
          css={css({
            position: 'relative',
            maxHeight: '100%',
          })}
        >
          <img
            css={{
              maxWidth: '100%',
              maxHeight: '100%',
              margin: 'auto',
              display: 'block',
            }}
            src={thumbnailExists.code}
            alt="Thumbnail"
          />
          <Element
            css={{
              position: 'absolute',
              background: 'rgba(21,21,21, 0.8)',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Tooltip label="Replace Thumbnail">
              <button
                type="button"
                onClick={uploadThumbnail}
                css={css({
                  cursor: 'pointer',
                  position: 'absolute',
                  border: 'none',
                  padding: 0,
                  transform: 'translateX(-50%) translateY(-50%)',
                  top: '50%',
                  left: '50%',
                  background: 'transparent',
                  transition: '200ms ease all',
                  ':hover': {
                    borderRadius: '50%',
                    backgroundColor: 'sideBar.background',
                  },
                })}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="7"
                    y="8"
                    width="17"
                    height="17"
                  >
                    <rect
                      x="7.70972"
                      y="8.28076"
                      width="15.8779"
                      height="16"
                      fill="#C4C4C4"
                    />
                  </mask>
                  <g mask="url(#mask0)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21.7164 8.89948C21.3773 8.55777 20.8341 8.55118 20.503 8.88475L19.9037 9.48874L22.3596 11.9636L22.959 11.3596C23.29 11.026 23.2835 10.4786 22.9444 10.1369L21.7164 8.89948ZM21.7603 12.5676L19.3043 10.0927L9.11489 20.3605L7.94537 24.0139L11.5709 22.8354L21.7603 12.5676Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </button>
            </Tooltip>
          </Element>
        </Element>
      );
    }
    return '+ Add thumbnail';
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
          onClick={() => (thumbnailExists ? null : uploadThumbnail())}
          type="button"
          css={css({
            marginTop: 6,
            background: 'transparent',
            borderWidth: '1px',
            borderStyle: 'dashed',
            borderColor: 'sideBar.border',
            color: 'mutedForeground',
            height: 103,
            padding: 0,
            outline: 'none',
            cursor: thumbnailExists ? 'auto' : 'pointer',
            overflow: 'hidden',
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
