import React from 'react';
import moment from 'moment';
import { sortBy } from 'lodash-es';
import filesize from 'filesize';
import DeleteFileButton from '../DeleteFileButton';
import AddFileToSandboxButton from '../AddFileToSandboxButton';
import { HeaderTitle, Table, StatBody, Body, FileRow } from './elements';

function FilesList({ files, deleteFile, addFileToSandbox }) {
  return (
    <div css={{ margin: '0 2rem' }}>
      <Table>
        <thead>
          <tr style={{ height: '3rem' }}>
            <HeaderTitle>File</HeaderTitle>
            <HeaderTitle>Created</HeaderTitle>
            <HeaderTitle>Size</HeaderTitle>
            <HeaderTitle />
            <HeaderTitle />
          </tr>
        </thead>
        <Body>
          {sortBy(files, 'name').map((f, i) => (
            <FileRow index={i} key={f.id}>
              <td
                style={{
                  maxWidth: 100,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={f.name}
              >
                <a target="_blank" rel="noreferrer noopener" href={f.url}>
                  {f.name}
                </a>
              </td>
              <td>{moment(f.insertedAt).format('ll')}</td>
              <td>{filesize(f.objectSize)}</td>
              <StatBody
                style={{ padding: '0.55rem 0.5rem', cursor: 'pointer' }}
              >
                <AddFileToSandboxButton
                  url={f.url}
                  name={f.name}
                  onAddFileToSandbox={addFileToSandbox}
                />
              </StatBody>
              <StatBody
                style={{ padding: '0.55rem 0.5rem', cursor: 'pointer' }}
              >
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
