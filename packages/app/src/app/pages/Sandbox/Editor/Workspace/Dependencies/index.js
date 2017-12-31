import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import { WorkspaceSubtitle } from '../elements';

import AddVersion from './AddVersion';
import VersionEntry from './VersionEntry';
import AddResource from './AddResource';
import ExternalResource from './ExternalResource';

import { Overlay } from './elements';

function Dependencies({ signals, store }) {
  const sandbox = store.editor.currentSandbox;
  const npmDependencies = sandbox.npmDependencies
    ? sandbox.npmDependencies.toJS()
    : {};

  return (
    <div>
      {store.workspace.isProcessingDependencies && (
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
                signals.workspace.npmDependencyRemoved({ name })
              }
              onRefresh={(name, version) =>
                signals.workspace.npmDependencyAdded({
                  name,
                  version,
                })
              }
            />
          ))}
        <AddVersion
          existingDependencies={Object.keys(npmDependencies)}
          addDependency={(name, version) =>
            signals.workspace.npmDependencyAdded({
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
              this.props.signals.workspace.externalResourceRemoved({
                resource,
              })
            }
          />
        ))}
        <AddResource
          addResource={resource =>
            signals.workspace.externalResourceAdded({
              resource,
            })
          }
        />
      </div>
    </div>
  );
}

export default inject('signals', 'store')(observer(Dependencies));
