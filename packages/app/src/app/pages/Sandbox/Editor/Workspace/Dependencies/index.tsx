import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import getTemplateDefinition from '@codesandbox/common/lib/templates';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { WorkspaceSubtitle } from '../elements';
import { AddFont } from './AddFont';
import { AddResource } from './AddResource';
import { AddVersion } from './AddVersion';
import { ErrorMessage } from './elements';
import { ExternalFonts } from './ExternalFonts';
import { ExternalResource } from './ExternalResource';
import { VersionEntry } from './VersionEntry';

export const Dependencies: FunctionComponent = () => {
  const {
    actions: {
      editor: { addNpmDependency, npmDependencyRemoved },
    },
    state: {
      editor: {
        currentSandbox: { externalResources, template },
        parsedConfigurations,
      },
    },
  } = useOvermind();
  const fonts = externalResources.filter(resource =>
    resource.includes('fonts.googleapis.com/css')
  );
  const otherResources = externalResources.filter(
    resource => !resource.includes('fonts.googleapis.com/css')
  );

  if (!parsedConfigurations?.package) {
    return <ErrorMessage>Unable to find package.json</ErrorMessage>;
  }

  const { error, parsed } = parsedConfigurations.package;
  if (error) {
    return (
      <ErrorMessage>We weren{"'"}t able to parse the package.json</ErrorMessage>
    );
  }

  const { dependencies = {} /* devDependencies = {} */ } = parsed;
  const { externalResourcesEnabled } = getTemplateDefinition(template);
  return (
    <div>
      <Margin bottom={0}>
        {Object.keys(dependencies)
          .sort()
          .map(dependency => (
            <VersionEntry
              dependencies={dependencies}
              dependency={dependency}
              key={dependency}
              onRefresh={(name, version) => addNpmDependency({ name, version })}
              onRemove={name => npmDependencyRemoved(name)}
            />
          ))}

        {/* {Object.keys(devDependencies).length > 0 && (
          <WorkspaceSubtitle>Development Dependencies</WorkspaceSubtitle>
        )}

        {Object.keys(devDependencies)
          .sort()
          .map(dependency => (
            <VersionEntry
              dependencies={devDependencies}
              dependency={dependency}
              key={dependency}
              onRefresh={(name, version) => addNpmDependency({ name, version })}
              onRemove={name => npmDependencyRemoved(name)}
            />
          ))} */}

        <AddVersion>Add Dependency</AddVersion>
      </Margin>

      {externalResourcesEnabled && (
        <div>
          <WorkspaceSubtitle>External Resources</WorkspaceSubtitle>

          <AddResource />

          {otherResources.map(resource => (
            <ExternalResource key={resource} resource={resource} />
          ))}

          <WorkspaceSubtitle>Google Fonts</WorkspaceSubtitle>

          <AddFont addedFonts={fonts} />

          {fonts.map(resource => (
            <ExternalFonts key={resource} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};
