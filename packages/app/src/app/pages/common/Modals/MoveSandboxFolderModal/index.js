import React from 'react';
import { inject, observer } from 'mobx-react';
import { basename } from 'path';
import Button from 'app/components/Button';
import ChevronRight from 'react-icons/lib/md/chevron-right';

import DirectoryPicker from './DirectoryPicker';
import { Container } from '../elements';

import { Block, CancelButton } from './elements';

class MoveSandboxFolderModal extends React.PureComponent {
  constructor(props) {
    super(props);

    const collection = props.store.editor.currentSandbox.collection;

    this.state = {
      teamId: collection ? collection.teamId : undefined,
      path: collection ? collection.path : '/',
    };
  }

  onSelect = ({ teamId, path }) => {
    this.setState({ teamId, path });
  };

  render() {
    const { path, teamId } = this.state;
    const { signals } = this.props;

    return (
      <div>
        <Block>Move to Folder</Block>
        <Container css={{ maxHeight: 400, overflow: 'auto' }}>
          <DirectoryPicker
            onSelect={this.onSelect}
            currentTeamId={teamId}
            currentPath={path}
          />
        </Container>
        <Block right>
          <CancelButton
            onClick={() => {
              signals.modalClosed();
            }}
          >
            Cancel
          </CancelButton>

          <Button css={{ display: 'inline-flex', alignItems: 'center' }} small>
            Move to{' '}
            {path !== '/'
              ? basename(path)
              : `${teamId ? 'Our' : 'My'} Sandboxes`}
            <ChevronRight
              css={{ marginRight: '-.25rem', marginLeft: '.25rem' }}
            />
          </Button>
        </Block>
      </div>
    );
  }
}

export default inject('store', 'signals')(observer(MoveSandboxFolderModal));
