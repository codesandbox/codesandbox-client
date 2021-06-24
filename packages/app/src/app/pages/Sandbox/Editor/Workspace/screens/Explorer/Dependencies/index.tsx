import { Collapsible, List, SidebarRow, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { motion } from 'framer-motion';
import React, { FunctionComponent, useState } from 'react';

import { Dependency } from './Dependency';
import { AddDependency } from './AddDependency';

const Animated = ({ children, showMountAnimations }) => (
  <motion.div
    animate={{ opacity: 1, height: 'auto' }}
    initial={showMountAnimations ? { opacity: 0, height: 0 } : null}
    exit={{ opacity: 0, height: 0 }}
    style={{ width: '100%', overflow: 'hidden' }}
  >
    {children}
  </motion.div>
);

export const Dependencies: FunctionComponent<{ readonly?: boolean }> = ({
  readonly = false,
}) => {
  const { addNpmDependency, npmDependencyRemoved } = useActions().editor;
  const { parsedConfigurations } = useAppState().editor;
  const [showMountAnimations, setShowMountAnimations] = useState(false);

  React.useEffect(() => {
    setShowMountAnimations(true);
  }, [setShowMountAnimations]);

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
            <Animated
              key={dependency}
              showMountAnimations={showMountAnimations}
            >
              <Dependency
                dependencies={dependencies}
                dependency={dependency}
                key={dependency}
                onRefresh={(name, version) =>
                  addNpmDependency({ name, version })
                }
                onRemove={npmDependencyRemoved}
              />
            </Animated>
          ))}
      </List>
    </Collapsible>
  );
};
