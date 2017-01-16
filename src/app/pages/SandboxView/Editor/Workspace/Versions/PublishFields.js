// @flow
import React from 'react';
import styled from 'styled-components';

import WorkspaceInputContainer from '../WorkspaceInputContainer';
import Button from '../../../../../components/buttons/Button';
import Relative from '../../../../../components/Relative';

const Inputs = styled.div`
  margin-bottom: 1rem;
  input {
    margin: 0;
    text-align: center;
    box-sizing: border-box;
    height: 100%;
    width: 100%;
  }
`;

const Dot = styled.div`
  position: absolute;
  color: ${props => props.theme.white};
  right: 0;
  bottom: 0.4rem;
`;

const initialState = {
  major: '',
  minor: '',
  patch: '',
};

type Props = {
  publishVersion: (version: string) => Promise<>;
};

export default class PublishFields extends React.PureComponent {
  props: Props;

  state = initialState;

  major: ?HTMLInputElement;
  minor: ?HTMLInputElement;
  patch: ?HTMLInputElement;

  handleMajorKey = (e: KeyboardEvent) => {
    if (e.keyCode === 190) {
      // dot
      if (this.minor != null) this.minor.focus();
    }
  };

  handleMinorKey = (e: KeyboardEvent) => {
    if (e.keyCode === 190) {
      // dot
      if (this.patch != null) this.patch.focus();
    } else if (e.keyCode === 8) {
      // backspace
      const { minor } = this.state;
      if (minor === '' && this.major != null) {
        // Prevent backspace in previous field
        this.major.focus();
        e.preventDefault();
      }
    }
  };

  handlePatchKey = (e: KeyboardEvent) => {
    if (e.keyCode === 8) {
      // backspace
      const { patch } = this.state;
      if (patch === '' && this.minor != null) {
        // Prevent backspace in previous field
        this.minor.focus();
        e.preventDefault();
      }
    }
  };

  publishVersion = async () => {
    const { major, minor, patch } = this.state;

    const version = `${major}.${minor}.${patch}`;
    await this.props.publishVersion(version);

    this.setState(initialState);
  };

  isValid = (n: string) => n === '' || /^[0-9]+$/.test(n);

  setMajor = e => this.isValid(e.target.value) && this.setState({ major: e.target.value });
  setMinor = e => this.isValid(e.target.value) && this.setState({ minor: e.target.value });
  setPatch = e => this.isValid(e.target.value) && this.setState({ patch: e.target.value });

  render() {
    const { major, minor, patch } = this.state;
    return (
      <Inputs>
        <WorkspaceInputContainer>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={(e) => { this.major = e; }}
              value={major}
              onChange={this.setMajor}
              onKeyDown={this.handleMajorKey}
            />
            <Dot>.</Dot>
          </Relative>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={(e) => { this.minor = e; }}
              value={minor}
              onChange={this.setMinor}
              onKeyDown={this.handleMinorKey}
            />
            <Dot>.</Dot>
          </Relative>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={(e) => { this.patch = e; }}
              value={patch}
              onChange={this.setPatch}
              onKeyDown={this.handlePatchKey}
            />
          </Relative>
          <Button
            small
            style={{ flex: 4, marginLeft: '0.25rem' }}
            disabled={!(major && minor && patch)}
            onClick={this.publishVersion}
          >
            Publish
          </Button>
        </WorkspaceInputContainer>
      </Inputs>
    );
  }
}
