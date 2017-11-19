import React from 'react';
import styled from 'styled-components';

import Button from 'app/components/buttons/Button';
import WorkspaceInputContainer from '../WorkspaceInputContainer';

const ButtonContainer = styled.div`margin: 0.5rem 1rem;`;

type State = {
  name: string,
  version: string,
};

type Props = {
  addDependency: (dependency: string, version: string) => Promise<boolean>,
  existingDependencies: Array<string>,
  processing: boolean,
};

const initialState = {
  name: '',
  version: '',
};

export default class AddVersion extends React.PureComponent {
  state = initialState;

  state: State;
  props: Props;

  setName = (e: KeyboardEvent) => {
    const { existingDependencies } = this.props;
    const name = e.target.value;
    this.setState({ name, replacing: existingDependencies.includes(name) });
  };

  setVersion = (e: KeyboardEvent) => {
    this.setState({ version: e.target.value });
  };

  addDependency = async () => {
    if (this.state.name) {
      await this.props.addDependency(this.state.name, this.state.version);
      this.setState(initialState);
    }
  };

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.keyCode === 13) {
      // Enter
      this.addDependency();
    }
  };

  render() {
    const { name, version, replacing } = this.state;
    const { processing } = this.props;
    const isValid = name !== '';
    return (
      <div style={{ position: 'relative' }}>
        <WorkspaceInputContainer>
          <input
            style={{ flex: 3 }}
            placeholder="package name"
            value={name}
            onChange={this.setName}
            onKeyUp={this.handleKeyUp}
          />
          <input
            style={{ flex: 1 }}
            placeholder="version"
            value={version}
            onChange={this.setVersion}
            onKeyUp={this.handleKeyUp}
          />
        </WorkspaceInputContainer>
        <ButtonContainer>
          <Button
            disabled={!isValid || processing}
            block
            small
            onClick={this.addDependency}
          >
            {replacing ? 'Replace' : 'Add'} Package
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}
