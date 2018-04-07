import React from 'react';
import { inject, observer } from 'mobx-react';

import DeleteFileButton from '../DeleteFileButton';

import { HeaderTitle, Table, StatBody, Body, FileRow } from './elements';

// eslint-disable-next-line
class FilesList extends React.Component {
  componentWillMount() {
    if (this.props.store.uploadedFiles === null) {
      this.props.signals.files.gotUploadedFiles();
    }
  }

  render() {
    const files = this.props.store.uploadedFiles || [];

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
              <td>{f.object_size}</td>
              <StatBody
                style={{ padding: '0.55rem 0.5rem', cursor: 'pointer' }}
              >
                <DeleteFileButton
                  id={f.id}
                  onDelete={this.props.signals.files.deletedUploadedFile}
                />
              </StatBody>
            </FileRow>
          ))}
        </Body>
      </Table>
    );
  }
}

export default inject('store', 'signals')(observer(FilesList));
