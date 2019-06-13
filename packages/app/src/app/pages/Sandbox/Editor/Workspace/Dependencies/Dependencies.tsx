import React from 'react';
import { observer } from 'mobx-react-lite';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import getDefinition from '@codesandbox/common/lib/templates';
import { useStore } from 'app/store';
import { WorkspaceSubtitle } from '../elements';
import { AddNpmDependency } from './AddNpmDependency';
import { VersionEntry } from './VersionEntry';
import { ExternalResource } from './ExternalResource';
import { AddExternalResource } from './AddExternalResource';
import { ErrorMessage } from './elements';

export const Dependencies = observer(() => {
  const {
    editor: { currentSandbox, parsedConfigurations },
  } = useStore();

  if (!parsedConfigurations.package) {
    return <ErrorMessage>Unable to find package.json</ErrorMessage>;
  }

  const { parsed, error } = parsedConfigurations.package;

  if (error) {
    return (
      <ErrorMessage>
        We weren
        {"'"}t able to parse the package.json
      </ErrorMessage>
    );
  }

  const dependencies = parsed.dependencies || {};
  const devDependencies = parsed.devDependencies || {};

  const templateDefinition = getDefinition(currentSandbox.template);

  return (
    <>
      <Margin bottom={1}>
        <WorkspaceSubtitle>Dependencies</WorkspaceSubtitle>
        {Object.keys(dependencies)
          .sort()
          .map(dep => (
            <VersionEntry
              key={dep}
              dependencies={dependencies}
              dependency={dep}
            />
          ))}
        <WorkspaceSubtitle>Development Dependencies</WorkspaceSubtitle>
        {Object.keys(devDependencies)
          .sort()
          .map(dep => (
            <VersionEntry
              key={dep}
              isDev
              dependencies={devDependencies}
              dependency={dep}
            />
          ))}
        <AddNpmDependency>Add Dependency</AddNpmDependency>
      </Margin>
      {templateDefinition.externalResourcesEnabled && (
        <>
          <WorkspaceSubtitle>External Resources</WorkspaceSubtitle>
          {(currentSandbox.externalResources || []).map(resource => (
            <ExternalResource key={resource} resource={resource} />
          ))}
          <AddExternalResource />
        </>
      )}
    </>
  );
});
