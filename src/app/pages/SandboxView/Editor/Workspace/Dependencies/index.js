import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { decamelize } from 'humps';

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

const mapDispatchToProps = dispatch => ({
  sourceActions: bindActionCreators(sourceEntity.actions, dispatch),
  sandboxActions: bindActionCreators(sandboxEntity.actions, dispatch),
});
class Dependencies extends React.PureComponent {
  addDependency = async (name: string, version: ?string): Promise<boolean> => {
    const { source, sourceActions } = this.props;
    if (source) {
      const realVersion = version || 'latest';
      const realName = name.toLowerCase();
      const success = await sourceActions.addNPMDependency(source.id, realName, realVersion);

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
  render() {
    const { source } = this.props;
    return (
      <div>
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
