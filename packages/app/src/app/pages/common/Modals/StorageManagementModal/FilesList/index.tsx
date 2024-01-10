import filesize from 'filesize';
import { sortBy } from 'lodash-es';
import React, { FunctionComponent, useState } from 'react';
import {
  Button,
  Stack,
  Element,
  List,
  ListAction,
  Link,
  Text,
  Checkbox,
} from '@codesandbox/components';

import { useAppState, useActions } from 'app/overmind';

import { AddFileToSandboxButton } from './AddFileToSandboxButton';
import { DeleteFileButton } from './DeleteFileButton';

export const FilesList: FunctionComponent = () => {
  const {
    files: { deletedUploadedFile, addedFileToSandbox },
  } = useActions();
  const {
    editor: { currentSandbox },
    uploadedFiles,
  } = useAppState();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getSelection = () =>
    uploadedFiles.filter(({ id }) => selectedItems.includes(id));

  const toggleCheckbox = (id: string) =>
    setSelectedItems(items =>
      items.includes(id) ? items.filter(item => item !== id) : items.concat(id)
    );

  return (
    <Element marginTop={4}>
      <Stack gap={2} marginBottom={6} justify="space-between">
        <Button
          autoWidth
          disabled={selectedItems.length === 0 || !currentSandbox}
          onClick={() => getSelection().map(addedFileToSandbox)}
        >
          Add all selected to project
        </Button>

        <Button
          variant="danger"
          autoWidth
          disabled={selectedItems.length === 0}
          onClick={() => selectedItems.map(deletedUploadedFile)}
        >
          Delete all selected
        </Button>
      </Stack>

      <List>
        {sortBy(uploadedFiles, 'name').map(
          ({ id, name, objectSize, url }, index) => (
            <ListAction justify="space-between" key={id}>
              <Stack
                gap={4}
                css={`
                  width: 40%;
                `}
              >
                <Checkbox
                  onChange={() => toggleCheckbox(id)}
                  checked={selectedItems.includes(id)}
                />
                <Link
                  css={`
                    max-width: 80%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                  size={3}
                  href={url}
                  rel="noreferrer noopener"
                  target="_blank"
                >
                  {name}
                </Link>
              </Stack>
              <Element
                css={`
                  width: 100px;
                `}
              >
                <Text size={3}>{filesize(objectSize)}</Text>
              </Element>
              <Stack gap={2}>
                <AddFileToSandboxButton name={name} url={url} />
                <DeleteFileButton id={id} />
              </Stack>
            </ListAction>
          )
        )}
      </List>
    </Element>
  );
};
