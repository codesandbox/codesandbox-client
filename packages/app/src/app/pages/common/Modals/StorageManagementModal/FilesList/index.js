import React from 'react';
import filesize from 'filesize';
import DeleteFileButton from '../DeleteFileButton';
import { HeaderTitle, Table, StatBody, Body, FileRow } from './elements';

function FilesList({ files, deleteFile }) {
  return (
    <Table>
      <thead>
        <tr style={{ height: '3rem' }}>
          <HeaderTitle>File</HeaderTitle>
          <HeaderTitle>Size</HeaderTitle>
          <HeaderTitle />
        </tr>
      </thead>
      <Body>
        {files.map((f, i) => (
          <FileRow index={i} key={f.id}>
            <td>
              <a href={f.url}>{f.name}</a>
            </td>
            <td>{filesize(f.objectSize)}</td>
            <StatBody style={{ padding: '0.55rem 0.5rem', cursor: 'pointer' }}>
              <DeleteFileButton id={f.id} onDelete={deleteFile} />
            </StatBody>
          </FileRow>
        ))}
      </Body>
    </Table>
  );
}

export default FilesList;
