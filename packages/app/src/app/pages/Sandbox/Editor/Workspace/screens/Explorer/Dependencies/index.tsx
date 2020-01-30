import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import {
  Collapsible,
  Text,
  SidebarRow,
  List,
  Button,
} from '@codesandbox/components';
import { Dependency } from './Dependency';

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
    <Collapsible title="Dependencies" defaultOpen>
      <List marginBottom={2}>
        {Object.keys(dependencies)
          .sort()
          .map(dependency => (
            <Dependency
              dependencies={dependencies}
              dependency={dependency}
              key={dependency}
              onRefresh={(name, version) => addNpmDependency({ name, version })}
              onRemove={name => npmDependencyRemoved({ name })}
            />
          ))}
      </List>
      <SidebarRow marginX={2}>
        <Button
          variant="secondary"
          onClick={() => modalOpened({ modal: 'searchDependencies' })}
        >
          Add dependency
        </Button>
      </SidebarRow>
    </Collapsible>
  );
};
