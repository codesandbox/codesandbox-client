import * as React from 'react';
import { inject } from 'mobx-react';
import Column from 'common/components/flex/Column';
import Centered from 'common/components/flex/Centered';
import Margin from 'common/components/spacing/Margin';
import Button from 'app/components/Button';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from './ShowcasePreview';

import { ErrorTitle } from './elements';

class Showcase extends React.Component {
  openModal = () => {
    /*
    modalActions.openModal({
      title: 'Select Showcase Sandbox',
      width: 600,
      Body: <SelectSandbox showcaseSandboxId={sandbox.id} />,
    });
    */
  };

  render() {
    const { sandbox, isCurrentUser } = this.props;

    if (!sandbox) {
      return (
        <Centered vertical horizontal>
          <Margin top={4}>
            <ErrorTitle>This user doesn{"'"}t have a sandbox yet</ErrorTitle>
          </Margin>
        </Centered>
      );
    }

    return (
      <Column alignItems="center">
        <Margin top={1}>
          {isCurrentUser && (
            <Button small onClick={this.openModal}>
              Change Sandbox
            </Button>
          )}
        </Margin>
        <Margin top={2} style={{ width: '100%' }}>
          <Column alignItems="initial">
            <div style={{ flex: 2 }}>
              <ShowcasePreview
                sandbox={sandbox}
                settings={this.props.store.editor.preferences.settings}
              />
            </div>
            <div style={{ flex: 1 }}>
              <SandboxInfo sandbox={sandbox} />
            </div>
          </Column>
        </Margin>
      </Column>
    );
  }
}

export default inject('signals', 'store')(Showcase);
