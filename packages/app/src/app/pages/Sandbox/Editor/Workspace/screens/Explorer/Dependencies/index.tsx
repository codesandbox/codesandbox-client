import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import { Text, SidebarRow, List, Button } from '@codesandbox/components';
import { VersionEntry } from './VersionEntry';

export const Dependencies: FunctionComponent = () => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency, npmDependencyRemoved },
    },
    state: {
      editor: { parsedConfigurations },
    },
  } = useOvermind();

  if (!parsedConfigurations?.package) {
    return (
      <SidebarRow marginX={2}>
        <Text variant="danger">Unable to find package.json</Text>
      </SidebarRow>
    );
  }

  const { error, parsed } = parsedConfigurations.package;

  if (error) {
    return (
      <SidebarRow marginX={2}>
        <Text variant="danger">We were not able to parse the package.json</Text>
      </SidebarRow>
    );
  }

  const { dependencies = {} } = parsed;

  return (
    <List>
      {Object.keys(dependencies)
        .sort()
        .map(dependency => (
          <VersionEntry
            dependencies={dependencies}
            dependency={dependency}
            key={dependency}
            onRefresh={(name, version) => addNpmDependency({ name, version })}
            onRemove={name => npmDependencyRemoved({ name })}
          />
        ))}

      <SidebarRow marginX={2}>
        <Button
          variant="secondary"
          onClick={() => modalOpened({ modal: 'searchDependencies' })}
        >
          Add dependency
        </Button>
      </SidebarRow>
    </List>
  );
};
