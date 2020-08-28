import {
  Button,
  Collapsible,
  List,
  SidebarRow,
  Text,
  SearchInput,
  ListAction,
  Element,
} from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';

import { Dependency } from './Dependency';

export const Dependencies: FunctionComponent<{ readonly?: boolean }> = ({
  readonly = false,
}) => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency, npmDependencyRemoved },
      workspace: { getExplorerDependencies, clearExplorerDependencies },
    },
    state: {
      workspace: { explorerDependencies },
      editor: { parsedConfigurations },
    },
  } = useOvermind();
  const [search, setSearch] = useState('');

  const searchDependencies = e => {
    setSearch(e.target.value);

    getExplorerDependencies(e.target.value);
  };

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

  const addDependency = dependency => {
    addNpmDependency({
      name: dependency.name,
      version: dependency.tags.latest,
    });
    setSearch('');
    clearExplorerDependencies();
  };

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
      {!readonly && (
        <>
          <SidebarRow
            css={css({ display: 'block', position: 'relative' })}
            marginX={2}
            marginBottom={2}
          >
            <SearchInput
              value={search}
              onChange={searchDependencies}
              placeholder="Add npm dependency"
              css={css({
                width: '100%',
              })}
            />
            {explorerDependencies.length ? (
              <Element
                css={css({
                  backgroundColor: 'sideBar.background',
                  position: 'absolute',
                  zIndex: 10,
                  width: '100%',
                  borderRadius: 'medium',
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: 'sideBar.border',
                  marginTop: '2px',
                  fontWeight: 500,
                })}
              >
                {explorerDependencies.map((dependency, i) => (
                  <ListAction
                    onClick={() => addDependency(dependency)}
                    key={dependency.objectID}
                    justify="space-between"
                    css={css({ color: 'sideBar.foreground', paddingY: 2 })}
                  >
                    <Text>{dependency.name}</Text>
                    <Text variant="muted">Ctrl + {i + 1}</Text>
                  </ListAction>
                ))}
                <ListAction
                  key="show-all"
                  justify="space-between"
                  css={css({
                    color: 'sideBar.foreground',
                    borderWidth: 0,
                    borderTopWidth: '1px',
                    borderStyle: 'solid',
                    borderColor: 'sideBar.border',
                    paddingY: 2,
                  })}
                  onClick={() => modalOpened({ modal: 'searchDependencies' })}
                >
                  <Text>Show All</Text>
                  <Text variant="muted">Ctrl + D</Text>
                </ListAction>
              </Element>
            ) : null}
          </SidebarRow>
          <SidebarRow marginX={2} marginBottom={4}>
            <Button
              variant="secondary"
              css={css({
                color: 'sideBar.foreground',
              })}
              onClick={() => modalOpened({ modal: 'searchDependencies' })}
            >
              All dependencies
            </Button>
          </SidebarRow>
        </>
      )}
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
