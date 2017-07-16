import React from 'react';

import Button from 'app/components/buttons/Button';

import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  id: string,
  deleteSandbox: (id: string) => void,
  newSandboxUrl: () => void,
};

export default class SandboxSettings extends React.PureComponent {
  props: Props;

  handleDeleteSandbox = async () => {
    const really = confirm('Are you sure you want to delete this sandbox?'); // TODO: confirm???
    if (really) {
      await this.props.deleteSandbox(this.props.id);
      await this.props.newSandboxUrl();
    }
  };

  render() {
    return (
      <WorkspaceInputContainer>
        <Button
          small
          block
          style={{ marginTop: '0.5rem', marginLeft: '-2px' }}
          onClick={this.handleDeleteSandbox}
        >
          Delete Sandbox
        </Button>
      </WorkspaceInputContainer>
    );
  }
}
