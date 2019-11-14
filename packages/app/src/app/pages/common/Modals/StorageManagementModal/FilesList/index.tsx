import { Button } from '@codesandbox/common/lib/components/Button';
import filesize from 'filesize';
import { sortBy } from 'lodash-es';
import React, { FunctionComponent, useState } from 'react';

import { useOvermind } from 'app/overmind';

import { AddFileToSandboxButton } from './AddFileToSandboxButton';
import { DeleteFileButton } from './DeleteFileButton';
import {
  Body,
  Buttons,
  CheckBox,
  Container,
  FileRow,
  HeaderTitle,
  StatBody,
  Table,
} from './elements';

export const FilesList: FunctionComponent = () => {
  const {
    actions: {
      files: { deletedUploadedFile, addedFileToSandbox },
    },
    state: {
      editor: { currentSandbox },
      uploadedFiles,
    },
  } = useOvermind();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const getSelection = () =>
    uploadedFiles.filter(({ id }) => selectedItems.includes(id));
  const toggleCheckbox = (id: string) =>
    setSelectedItems(items =>
      items.includes(id) ? items.filter(item => item !== id) : items.concat(id)
    );

  return (
    <Container>
      <Buttons>
        <Button
          disabled={selectedItems.length === 0 || !currentSandbox}
          onClick={() => getSelection().map(addedFileToSandbox)}
          small
        >
          Add all selected to project
        </Button>

        <Button
          disabled={selectedItems.length === 0}
          onClick={() => selectedItems.map(deletedUploadedFile)}
          small
        >
          Delete all selected
        </Button>
      </Buttons>

      <Table>
        <thead>
          <tr
            css={`
              height: 3rem;
            `}
          >
            <HeaderTitle
              css={`
                padding-left: 1rem;
                max-width: 20px;
              `}
            />

            <HeaderTitle>File</HeaderTitle>

            <HeaderTitle>Size</HeaderTitle>

            <HeaderTitle />

            <HeaderTitle />

            <HeaderTitle />
          </tr>
        </thead>

        <Body>
          {sortBy(uploadedFiles, 'name').map(
            ({ id, name, objectSize, url }, index) => (
              <FileRow index={index} key={id}>
                <td>
                  <CheckBox
                    onClick={() => toggleCheckbox(id)}
                    selected={selectedItems.includes(id)}
                  />
                </td>

                <td
                  css={`
                    max-width: 100px;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                  `}
                  title={name}
                >
                  <a href={url} rel="noreferrer noopener" target="_blank">
                    {name}
                  </a>
                </td>

                <td>{filesize(objectSize)}</td>

                <StatBody
                  css={`
                    padding: 0.55rem 0.5rem;
                    cursor: pointer;
                  `}
                >
                  <AddFileToSandboxButton name={name} url={url} />
                </StatBody>

                <StatBody
                  css={`
                    padding: 0.55rem 0.5rem;
                    cursor: pointer;
                  `}
                >
                  <DeleteFileButton id={id} />
                </StatBody>
              </FileRow>
            )
          )}
        </Body>
      </Table>
    </Container>
  );
};
