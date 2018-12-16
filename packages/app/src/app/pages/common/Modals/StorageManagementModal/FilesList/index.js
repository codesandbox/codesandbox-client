import React from 'react';
import moment from 'moment';
import { sortBy } from 'lodash-es';
import filesize from 'filesize';
import DeleteFileButton from '../DeleteFileButton';
import AddFileToSandboxButton from '../AddFileToSandboxButton';
import {
  HeaderTitle,
  Table,
  StatBody,
  Body,
  FileRow,
  TR,
  Name,
} from './elements';

function FilesList({ files, deleteFile, addFileToSandbox }) {
  return (
    <div
      css={`
        margin: 0 2rem;
      `}
    >
      <Table>
        <thead>
          <TR>
            <HeaderTitle>File</HeaderTitle>
            <HeaderTitle>Created</HeaderTitle>
            <HeaderTitle>Size</HeaderTitle>
            <HeaderTitle />
            <HeaderTitle />
          </TR>
        </thead>
        <Body>
          {sortBy(files, 'name').map((f, i) => (
            <FileRow index={i} key={f.id}>
              <Name title={f.name}>
                <a target="_blank" rel="noreferrer noopener" href={f.url}>
                  {f.name}
                </a>
              </Name>
              <td>{moment(f.insertedAt).format('ll')}</td>
              <td>{filesize(f.objectSize)}</td>
              <StatBody pointer>
                <AddFileToSandboxButton
                  url={f.url}
                  name={f.name}
                  onAddFileToSandbox={addFileToSandbox}
                />
              </StatBody>
              <StatBody pointer>
                <DeleteFileButton id={f.id} onDelete={deleteFile} />
              </StatBody>
            </FileRow>
          ))}
        </Body>
      </Table>
    </div>
  );
}

export default FilesList;
