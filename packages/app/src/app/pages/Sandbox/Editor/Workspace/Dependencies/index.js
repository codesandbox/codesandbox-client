import * as React from 'react';
import { inject, observer } from 'mobx-react';

import Margin from 'common/components/spacing/Margin';
import { WorkspaceSubtitle } from '../elements';

import AddVersion from './AddVersion';
import VersionEntry from './VersionEntry';
import AddResource from './AddResource';
import ExternalResource from './ExternalResource';

import { ErrorMessage } from './elements';

function Dependencies({ signals, store }) {
  const sandbox = store.editor.currentSandbox;

  const { parsed, error } = store.editor.parsedConfigurations.package;

  if (error) {
    return (
      <ErrorMessage>We weren{"'"}t able to parse the package.json</ErrorMessage>
    );
  }

  const dependencies = parsed.dependencies || {};
  // const devDependencies = parsed.devDependencies || {};

  return (
    <div>
      <Margin bottom={0}>
        <WorkspaceSubtitle>Dependencies</WorkspaceSubtitle>
        {Object.keys(dependencies)
          .sort()
          .map(dep => (
            <VersionEntry
              key={dep}
              dependencies={dependencies}
              dependency={dep}
              onRemove={name => signals.editor.npmDependencyRemoved({ name })}
              onRefresh={(name, version) =>
                signals.editor.addNpmDependency({
                  name,
                  version,
                })
              }
            />
          ))}
        {/* {Object.keys(devDependencies).length > 0 && (
          <WorkspaceSubtitle>Development Dependencies</WorkspaceSubtitle>
        )}
        {Object.keys(devDependencies)
          .sort()
          .map(dep => (
            <VersionEntry
              key={dep}
              dependencies={devDependencies}
              dependency={dep}
              onRemove={name => signals.editor.npmDependencyRemoved({ name })}
              onRefresh={(name, version) =>
                signals.editor.addNpmDependency({
                  name,
                  version,
                })
              }
            />
          ))} */}
        <AddVersion>Add Dependency</AddVersion>
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
