import * as React from 'react';
import { connect } from 'app/fluent';

import Margin from 'common/components/spacing/Margin';
import getDefinition from 'common/templates';
import { WorkspaceSubtitle } from '../elements';

import AddVersion from './AddVersion';
import VersionEntry from './VersionEntry';
import AddResource from './AddResource';
import ExternalResource from './ExternalResource';

import { ErrorMessage } from './elements';

export default connect()
  .with(({ state, signals }) => ({
    sandbox: state.editor.currentSandbox,
    parsedConfigurations: state.editor.parsedConfigurations,
    npmDependencyRemoved: signals.editor.npmDependencyRemoved,
    addNpmDependency: signals.editor.addNpmDependency,
    externalResourceAdded: signals.workspace.externalResourceAdded,
    externalResourceRemoved: signals.workspace.externalResourceRemoved,
  }))
  .to(
    function Dependencies({ sandbox, parsedConfigurations, npmDependencyRemoved, addNpmDependency, externalResourceRemoved, externalResourceAdded }) {
      const { parsed, error } = parsedConfigurations.package;

      if (error) {
        return (
          <ErrorMessage>We weren{"'"}t able to parse the package.json</ErrorMessage>
        );
      }

      const dependencies = parsed.dependencies || {};
      // const devDependencies = parsed.devDependencies || {};

      const templateDefinition = getDefinition(sandbox.template);

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
                  onRemove={name => npmDependencyRemoved({ name })}
                  onRefresh={(name, version) =>
                    addNpmDependency({
                      name,
                      version,
                    })
                  }
                />
              ))}
            <AddVersion>Add Dependency</AddVersion>
          </Margin>
          {templateDefinition.externalResourcesEnabled && (
            <div>
              <WorkspaceSubtitle>External Resources</WorkspaceSubtitle>
              {(sandbox.externalResources || []).map(resource => (
                <ExternalResource
                  key={resource}
                  resource={resource}
                  removeResource={() =>
                    externalResourceRemoved({
                      resource,
                    })
                  }
                />
              ))}
              <AddResource
                addResource={resource =>
                  externalResourceAdded({
                    resource,
                  })
                }
              />
            </div>
          )}
        </div>
      );
    }
  )
