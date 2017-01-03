import React from 'react';
import styled from 'styled-components';

import WorkspaceSubtitle from '../WorkspaceSubtitle';
import Button from '../../../../../components/buttons/Button';

const ButtonContainer = styled.div`
  margin: 0.5rem 1rem;
`;

const InputContainer = styled.div`
  display: inline-block;
  display: flex;
  overflow: visible;
  font-size: .875rem;
  margin: 0.5rem 0.75rem;
  input {
    transition: 0.3s ease all;
    font-family: inherit;
    margin: 0 0.25rem;
    padding: 0.25rem;
    width: 100%;
    outline: none;
    border: none;
    background-color: ${props => (props.errorMessage ? props.theme.redBackground.clearer(0.5) : 'rgba(0, 0, 0, 0.2)')};
    color: ${props => (props.errorMessage ? props.theme.red : props.theme.white)};

    &:focus {
      border: none;
      outline: none;
    }
  }

  input::-webkit-input-placeholder {
    color: ${props => props.theme.background2.lighten(2.9)};
  }
`;

type State = {
  name: string;
  version: string;
};

type Props = {
  addDependency: (dependency: string, version: string) => Promise<boolean>;
  existingDependencies: Array<string>;
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
    const result = await this.props.addDependency(this.state.name, this.state.version);

    if (result === true) this.setState(initialState);
  }

  render() {
    const { name, version, replacing } = this.state;
    const isValid = name !== '';
    return (
      <div>
        <WorkspaceSubtitle>Add or change an NPM Package</WorkspaceSubtitle>
        <InputContainer>
          <input
            style={{ flex: 3 }}
            placeholder="package name"
            value={name}
            onChange={this.setName}
          />
          <input
            style={{ flex: 1 }}
            placeholder="version"
            value={version}
            onChange={this.setVersion}
          />
        </InputContainer>
        <ButtonContainer>
          <Button disabled={!isValid} block small onClick={this.addDependency}>
            {replacing ? 'replace' : 'add'} Package
          </Button>
        </ButtonContainer>
      </div>
    );
  }
}
