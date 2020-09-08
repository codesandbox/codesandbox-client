import { Collapsible, List, SidebarRow, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';

import React, { FunctionComponent } from 'react';

import { Dependency } from './Dependency';
import { AddDependency } from './AddDependency';

export const Dependencies: FunctionComponent<{ readonly?: boolean }> = ({
  readonly = false,
}) => {
  const {
    actions: {
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
    <Collapsible
      title="Dependencies"
      defaultOpen
      css={css({
        'div[open]': {
          overflow: 'visible',
        },
      })}
    >
      {!readonly && <AddDependency />}
      <List>
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
    </Collapsible>
  );
};
