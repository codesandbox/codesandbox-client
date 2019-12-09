import React from 'react';

import { Button } from '@codesandbox/common/lib/components/Button';
import { ENTER } from '@codesandbox/common/lib/utils/keycodes';
import { WorkspaceInputContainer } from '../../elements';
import { ButtonContainer } from './elements';

const initialState = {
  name: '',
};

export class AddResource extends React.PureComponent {
  state = initialState;

  setName = e => {
    const name = e.target.value;
    this.setState({ name });
  };

  addResource = async () => {
    if (this.state.name) {
      await this.props.addResource(this.state.name.trim());
      this.setState(initialState);
    }
  };

  handleKeyUp = e => {
    if (e.keyCode === ENTER) {
      this.addResource();
    }
  };

  render() {
    const { name } = this.state;
    const isValid = name !== '';
    return (
      <div style={{ position: 'relative' }}>
        <WorkspaceInputContainer>
          <input
            placeholder="https://cdn.com/bootstrap.css"
            value={name}
            onChange={this.setName}
            onKeyUp={this.handleKeyUp}
          />
        </WorkspaceInputContainer>
        <ButtonContainer>
          <Button disabled={!isValid} block small onClick={this.addResource}>
            Add Resource
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}
