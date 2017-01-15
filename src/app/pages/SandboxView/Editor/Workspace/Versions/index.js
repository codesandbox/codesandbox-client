// @flow
import React from 'react';
import styled from 'styled-components';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';
import DotIcon from 'react-icons/lib/go/primitive-dot';

import WorkspaceTitle from '../WorkspaceTitle';
import versionEntity from '../../../../../store/entities/versions';
import type { Sandbox } from '../../../../../store/entities/sandboxes/index';
import type { Version } from '../../../../../store/entities/versions/index';
import { versionsBySandboxSelector } from '../../../../../store/entities/versions/selector';

import EntryContainer from '../EntryContainer';
import WorkspaceInputContainer from '../WorkspaceInputContainer';
import Button from '../../../../../components/buttons/Button';
import Relative from '../../../../../components/Relative';

type Props = {
  sandbox: Sandbox;
  versions: Array<Version>;
};

const Description = styled.p`
  color: ${props => props.theme.background.lighten(2)};
  margin-top: 0;
  padding: 0 1rem;
  line-height: 1.2;
  font-size: .875rem;
`;

const VersionTitle = styled.span`
  padding-left: 0.5rem;
  vertical-align: middle;
`;

const VersionDate = styled.div`
  position: absolute;
  right: 1rem;
  color: ${props => props.theme.background.lighten(2).clearer(0.5)};
`;

const Icon = styled.span`
  vertical-align: middle;
`;

const Inputs = styled.div`
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

const mapDispatchToProps = dispatch => ({
  versionActions: bindActionCreators(versionEntity.actions, dispatch),
});
const mapStateToProps = (state, props: Props) => ({
  versions: versionsBySandboxSelector(state, { sandbox: props.sandbox }),
});
class Versions extends React.PureComponent {
  props: Props;

  major: ?HTMLInputElement;
  minor: ?HTMLInputElement;
  patch: ?HTMLInputElement;

  state = {
    major: '',
    minor: '',
    patch: '',
  };

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
  }

  isValid = (n: string) => n === '' || /^[0-9]+$/.test(n);

  setMajor = e => this.isValid(e.target.value) && this.setState({ major: e.target.value });
  setMinor = e => this.isValid(e.target.value) && this.setState({ minor: e.target.value });
  setPatch = e => this.isValid(e.target.value) && this.setState({ patch: e.target.value });

  render() {
    const { versions } = this.props;
    const { major, minor, patch } = this.state;
    return (
      <div>
        <WorkspaceTitle>Versions</WorkspaceTitle>
        <Description>
          You can publish versions of your sandbox to make your sandbox available
          for others to use as a dependency.
        </Description>

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
            <Button small style={{ flex: 4, marginLeft: '0.25rem' }}>Publish</Button>
          </WorkspaceInputContainer>
        </Inputs>

        {versions.map(v => (
          <EntryContainer key={v.version}>
            <Icon><DotIcon /></Icon>
            <VersionTitle>{v.version}</VersionTitle>
            <VersionDate>{moment(v.insertedAt).format('lll')}</VersionDate>
          </EntryContainer>
        ))}
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Versions);
