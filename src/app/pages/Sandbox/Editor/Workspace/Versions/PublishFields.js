// @flow eslint-disable
import * as React from 'react';
import styled from 'styled-components';

import WorkspaceInputContainer from '../WorkspaceInputContainer';
import Button from '../../../../../components/buttons/Button';
import Relative from '../../../../../components/Relative';
import type { Version } from '../../../../../store/entities/versions/index'; // eslint-disable-line

const Inputs = styled.div`
  margin-bottom: 1rem;
  padding: 0 0.25rem;
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

const ErrorMessage = styled.div`
  margin: 1rem;
  font-size: 0.875rem;
  color: ${props => props.theme.red};
`;

const initialState = {
  major: '',
  minor: '',
  patch: '',
  errorMessage: '',
};

type Props = {
  publishVersion: (version: string) => Promise<>,
  versions: Array<Version>,
};

type State = {
  major: string,
  minor: string,
  patch: string,
  errorMessage: string,
};

const DUPLICATE_VERSION_INFO =
  'You cannot publish a version that already exists.';

export default class PublishFields extends React.PureComponent<Props, State> {
  state = initialState;

  major: ?HTMLInputElement;
  minor: ?HTMLInputElement;
  patch: ?HTMLInputElement;

  getVersion = (
    {
      major = this.state.major,
      minor = this.state.minor,
      patch = this.state.patch,
    }: { major?: string, minor?: string, patch?: string } = {}
  ) => `${major}.${minor}.${patch}`;

  isDuplicateVersion = (version: string = this.getVersion()) =>
    !!this.props.versions.find(v => v.version === version);

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
    const version = this.getVersion();
    await this.props.publishVersion(version);

    this.setState(initialState);
  };

  setStatus = (versionInfo: {
    major?: string,
    minor?: string,
    patch?: string,
  }) => {
    if (this.isDuplicateVersion(this.getVersion(versionInfo))) {
      this.setState({ errorMessage: DUPLICATE_VERSION_INFO });
    } else {
      this.setState({ errorMessage: '' });
    }
  };

  isValid = (n: string) => n === '' || /^[0-9]+$/.test(n);

  setMajor = e => {
    if (this.isValid(e.target.value)) {
      this.setState({ major: e.target.value });
      this.setStatus({ major: e.target.value });
    }
  };
  setMinor = e => {
    if (this.isValid(e.target.value)) {
      this.setState({ minor: e.target.value });
      this.setStatus({ minor: e.target.value });
    }
  };
  setPatch = e => {
    if (this.isValid(e.target.value)) {
      this.setState({ patch: e.target.value });
      this.setStatus({ patch: e.target.value });
    }
  };

  render() {
    const { major, minor, patch } = this.state;

    const duplicateVersion = false && this.isDuplicateVersion();

    return (
      <Inputs>
        <WorkspaceInputContainer>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={e => {
                this.major = e;
              }}
              value={major}
              onChange={this.setMajor}
              onKeyDown={this.handleMajorKey}
            />
            <Dot>.</Dot>
          </Relative>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={e => {
                this.minor = e;
              }}
              value={minor}
              onChange={this.setMinor}
              onKeyDown={this.handleMinorKey}
            />
            <Dot>.</Dot>
          </Relative>
          <Relative style={{ flex: 1 }}>
            <input
              placeholder="0"
              ref={e => {
                this.patch = e;
              }}
              value={patch}
              onChange={this.setPatch}
              onKeyDown={this.handlePatchKey}
            />
          </Relative>
          <Button
            small
            style={{ flex: 4, marginLeft: '0.25rem' }}
            disabled={!(major && minor && patch) || duplicateVersion}
            onClick={this.publishVersion}
          >
            Publish
          </Button>
        </WorkspaceInputContainer>
        <ErrorMessage>{this.state.errorMessage}</ErrorMessage>
      </Inputs>
    );
  }
}
