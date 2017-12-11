import * as React from 'react';
import styled from 'styled-components';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import WorkspaceSubtitle from '../WorkspaceSubtitle';

import AddVersion from './AddVersion';
import VersionEntry from './VersionEntry';
import AddResource from './AddResource';
import ExternalResource from './ExternalResource';

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

function Dependencies({ signals, store }) {
  const sandbox = store.editor.currentSandbox;
  const npmDependencies = sandbox.npmDependencies
    ? sandbox.npmDependencies.toJS()
    : {};

  return (
    <div>
      {store.editor.workspace.isProcessingDependencies && (
        <Overlay>We{"'"}re processing dependencies, please wait...</Overlay>
      )}
      <Margin bottom={0}>
        <WorkspaceSubtitle>NPM Packages</WorkspaceSubtitle>
        {Object.keys(npmDependencies)
          .sort()
          .map(dep => (
            <VersionEntry
              key={dep}
              dependencies={npmDependencies}
              dependency={dep}
              onRemove={name =>
                signals.editor.workspace.npmDependencyRemoved({ name })
              }
              onRefresh={(name, version) =>
                signals.editor.workspace.npmDependencyAdded({
                  name,
                  version,
                })
              }
            />
          ))}
        <AddVersion
          existingDependencies={Object.keys(npmDependencies)}
          addDependency={(name, version) =>
            signals.editor.workspace.npmDependencyAdded({
              name,
              version,
            })
          }
        />
      </Margin>
      <div>
        <WorkspaceSubtitle>External Resources</WorkspaceSubtitle>
        {(sandbox.externalResources || []).map(resource => (
          <ExternalResource
            key={resource}
            resource={resource}
            removeResource={() =>
              this.props.signals.editor.workspace.externalResourceRemoved({
                resource,
              })
            }
          />
        ))}
        <AddResource
          addResource={resource =>
            signals.editor.workspace.externalResourceAdded({
              resource,
            })
          }
        />
      </div>
    </div>
  );
}

export default inject('signals', 'store')(observer(Dependencies));
