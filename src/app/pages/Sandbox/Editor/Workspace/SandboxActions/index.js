import React from 'react';

import Button from 'app/components/buttons/Button';

import WorkspaceInputContainer from '../WorkspaceInputContainer';

type Props = {
  id: string,
  deleteSandbox: (id: string) => void,
};

export default class SandboxSettings extends React.PureComponent {
  props: Props;

  handleDeleteSandbox = () => {
    const really = confirm('Are you sure you want to delete this sandbox?');
    if (really) {
      this.props.deleteSandbox(this.props.id);
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
