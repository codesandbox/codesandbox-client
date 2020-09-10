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

type Props = {
  readonly: boolean;
};
export const Dependencies: FunctionComponent<Props> = ({ readonly }) => {
  const {
    actions: { modalOpened },
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
    <Collapsible defaultOpen title="Dependencies">
      <List marginBottom={2}>
        {Object.keys(dependencies)
          .sort()
          .map(dependency => (
            <Dependency
              dependencies={dependencies}
              dependency={dependency}
              key={dependency}
            />
          ))}
      </List>

      {readonly ? null : (
        <SidebarRow marginX={2}>
          <Button
            onClick={() => modalOpened({ modal: 'searchDependencies' })}
            variant="secondary"
          >
            Add dependency
          </Button>
        </SidebarRow>
      )}
    </Collapsible>
  );
};
