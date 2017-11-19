// @flow

import * as React from 'react';
import styled from 'styled-components';

import Margin from 'common/components/spacing/Margin';
import sandboxActionCreators from 'app/store/entities/sandboxes/actions';

import WorkspaceSubtitle from '../WorkspaceSubtitle';

import AddVersion from './AddVersion';
import VersionEntry from './VersionEntry';
import AddResource from './AddResource';
import ExternalResource from './ExternalResource';

type Props = {
  sandboxId: string,
  npmDependencies: { [dep: string]: string },
  externalResources: Array<string>,
  sandboxActions: typeof sandboxActionCreators,
  processing: boolean,
};

type State = {
  processing: boolean,
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

export default class Dependencies extends React.PureComponent<Props, State> {
  state = {
    processing: false,
  };

  addDependency = async (name: string, version: ?string): Promise<void> => {
    const { sandboxId, sandboxActions } = this.props;
    const realVersion = version || 'latest';
    const realName = name.toLowerCase();
    this.setState({
      processing: true,
    });
    try {
      await sandboxActions.addNPMDependency(sandboxId, realName, realVersion);
    } catch (e) {
      console.error(e);
    }
    this.setState({
      processing: false,
    });
  };

  addResource = async (resource: string) => {
    const { sandboxId, sandboxActions } = this.props;
    this.setState({
      processing: true,
    });
    try {
      await sandboxActions.addExternalResource(sandboxId, resource);
    } catch (e) {
      console.error(e);
    }
    this.setState({
      processing: false,
    });
  };

  removeDependency = async (name: string) => {
    const { sandboxId, sandboxActions } = this.props;
    this.setState({
      processing: true,
    });
    try {
      await sandboxActions.removeNPMDependency(sandboxId, name);
    } catch (e) {
      console.error(e);
    }
    this.setState({
      processing: false,
    });
  };

  removeResource = async (resource: string) => {
    const { sandboxId, sandboxActions } = this.props;
    this.setState({
      processing: true,
    });
    try {
      await sandboxActions.removeExternalResource(sandboxId, resource);
    } catch (e) {
      console.error(e);
    }
    this.setState({
      processing: false,
    });
  };

  render() {
    const {
      npmDependencies = {},
      externalResources = [],
      processing: fetchingDependencies,
    } = this.props;
    const processing = fetchingDependencies || this.state.processing;

    return (
      <div>
        {processing && (
          <Overlay>We{"'"}re processing dependencies, please wait...</Overlay>
        )}
        <Margin bottom={0}>
          <WorkspaceSubtitle>NPM Packages</WorkspaceSubtitle>
          {(Object.keys(npmDependencies) || [])
            .sort()
            .map(dep => (
              <VersionEntry
                key={dep}
                dependencies={npmDependencies}
                dependency={dep}
                onRemove={this.removeDependency}
                onRefresh={this.addDependency}
              />
            ))}
          <AddVersion
            existingDependencies={Object.keys(npmDependencies)}
            addDependency={this.addDependency}
          />
        </Margin>
        <div>
          <WorkspaceSubtitle>External Resources</WorkspaceSubtitle>
          {(externalResources || [])
            .map(resource => (
              <ExternalResource
                key={resource}
                resource={resource}
                removeResource={this.removeResource}
              />
            ))}
          <AddResource addResource={this.addResource} />
        </div>
      </div>
    );
  }
}
