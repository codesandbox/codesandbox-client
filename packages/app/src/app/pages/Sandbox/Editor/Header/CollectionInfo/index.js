import React from 'react';
import { basename } from 'path';
import { inject } from 'mobx-react';

import { SandboxName, FolderName } from './elements';

class CollectionInfo extends React.PureComponent {
  render() {
    const { sandbox, signals } = this.props;

    const folderName = sandbox.collection
      ? basename(sandbox.collection.path) ||
        (sandbox.collection.teamId ? sandbox.team.name : 'My Sandboxes')
      : 'My Sandboxes';

    return (
      <div
        css={{
          fontSize: '.875rem',
        }}
      >
        <FolderName
          onClick={() => {
            signals.modalOpened({
              modal: 'moveSandbox',
            });
          }}
        >
          {folderName}
        </FolderName>{' '}
        / <SandboxName>Untitled</SandboxName>
      </div>
    );
  }
}

export default inject('signals')(CollectionInfo);
