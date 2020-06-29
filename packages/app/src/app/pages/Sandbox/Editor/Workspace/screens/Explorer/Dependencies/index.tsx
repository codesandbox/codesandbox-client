import {
  Button,
  Collapsible,
  List,
  SidebarRow,
  Text,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { Dependency } from './Dependency';

export const Dependencies: FunctionComponent<{ readonly?: boolean }> = ({
  readonly = false,
}) => {
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
              onRemove={npmDependencyRemoved}
            />
          ))}
      </List>
      {!readonly && (
        <SidebarRow marginX={2}>
          <Button
            variant="secondary"
            onClick={() => modalOpened({ modal: 'searchDependencies' })}
          >
            Add dependency
          </Button>
        </SidebarRow>
      )}
    </Collapsible>
  );
};
