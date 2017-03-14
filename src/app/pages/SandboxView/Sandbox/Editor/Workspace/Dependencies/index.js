import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';

import WorkspaceTitle from '../WorkspaceTitle';
import WorkspaceSubtitle from '../WorkspaceSubtitle';
import AddVersion from './AddVersion';
import sourceEntity from '../../../../../store/entities/sources';
import sandboxEntity from '../../../../../store/entities/sandboxes';
import type { Source } from '../../../../../store/entities/sources/';
import type { Sandbox } from '../../../../../store/entities/sandboxes/';
import VersionEntry from './VersionEntry';

type Props = {
  sandbox: Sandbox;
  source: Source;
  sourceActions: sourceEntity.actions;
  sandboxActions: sandboxEntity.actions;
};

type State = {
  processing: boolean;
};

const Overlay = styled.div`
  position: absolute;
  display: flex;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  color: white;
  background-color: rgba(0, 0, 0, 0.2);
  align-items: center;
  text-align: center;
  z-index: 20;
  user-select: none;
`;

const mapDispatchToProps = dispatch => ({
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class Dependencies extends React.PureComponent {
  state = {
    processing: false,
  };

  addDependency = async (name: string, version: ?string): Promise<boolean> => {
    const { source, sourceActions } = this.props;
    if (source) {
      const realVersion = version || 'latest';
      const realName = name.toLowerCase();
      this.setState({
        processing: true,
      });
      const success = await sourceActions.addNPMDependency(source.id, realName, realVersion);
      this.setState({
        processing: false,
      });
      if (success) {
        this.commitDependencies();
        return true;
      }
    }
    return false;
  };

  commitDependencies = () => {
    const { sandbox, sandboxActions } = this.props;
    if (sandbox) {
      sandboxActions.commitDependencies(sandbox.id);
    }
  };

  handleRemove = (name: string) => {
    const { source, sourceActions } = this.props;
    if (source) {
      sourceActions.removeNPMDependency(source.id, name);

      this.commitDependencies();
    }
  }

  props: Props;
  state: State;

  render() {
    const { source } = this.props;
    const bundle = source.bundle || {};
    const processing = bundle.processing || this.state.processing;

    return (
      <div>
        {processing && <Overlay>We{"'"}re processing dependencies, please wait...</Overlay>}
        <WorkspaceTitle>
          Dependencies
        </WorkspaceTitle>
        <div>
          <WorkspaceSubtitle>
            NPM Packages
          </WorkspaceSubtitle>
          {Object.keys(source.npmDependencies).sort().map(dep => (
            <VersionEntry
              key={dep}
              dependencies={source.npmDependencies}
              dependency={dep}
              onRemove={this.handleRemove}
            />
          ))}
          <AddVersion
            existingDependencies={Object.keys(source.npmDependencies)}
            addDependency={this.addDependency}
          />
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(Dependencies);
