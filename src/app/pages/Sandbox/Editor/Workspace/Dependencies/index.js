// @flow

import React from 'react';
import styled from 'styled-components';
import { translate } from 'react-i18next';

import Margin from 'app/components/spacing/Margin';
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
  t: Function,
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

class Dependencies extends React.PureComponent {
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

  props: Props;
  state: State;

  render() {
    const {
      npmDependencies = {},
      externalResources = [],
      processing: fetchingDependencies,
      t,
    } = this.props;
    const processing = fetchingDependencies || this.state.processing;

    return (
      <div>
        {processing &&
          <Overlay>
            {t('dependencies.processingOverlay')}
          </Overlay>}
        <Margin bottom={0}>
          <WorkspaceSubtitle>
            {t('dependencies.title.npm')}
          </WorkspaceSubtitle>
          {(Object.keys(npmDependencies) || [])
            .sort()
            .map(dep =>
              <VersionEntry
                key={dep}
                dependencies={npmDependencies}
                dependency={dep}
                onRemove={this.removeDependency}
                onRefresh={this.addDependency}
              />,
            )}
          <AddVersion
            existingDependencies={Object.keys(npmDependencies)}
            addDependency={this.addDependency}
          />
        </Margin>
        <div>
          <WorkspaceSubtitle>
            {t('dependencies.title.external')}
          </WorkspaceSubtitle>
          {(externalResources || [])
            .sort()
            .map(resource =>
              <ExternalResource
                key={resource}
                resource={resource}
                removeResource={this.removeResource}
              />,
            )}
          <AddResource addResource={this.addResource} />
        </div>
      </div>
    );
  }
}

export default translate('workspace')(Dependencies);
