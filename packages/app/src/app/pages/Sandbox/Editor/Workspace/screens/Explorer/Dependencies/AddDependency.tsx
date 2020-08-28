import {
  SidebarRow,
  Text,
  SearchInput,
  ListAction,
  Element,
} from '@codesandbox/components';
import css from '@styled-system/css';
import useKeys from 'react-use/lib/useKeyboardJs';
import { useOvermind } from 'app/overmind';

import React, { FunctionComponent, useState, useEffect } from 'react';

export const AddDependency: FunctionComponent<{ readonly?: boolean }> = () => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency },
      workspace: { getExplorerDependencies, clearExplorerDependencies },
    },
    state: {
      workspace: { explorerDependencies },
    },
  } = useOvermind();
  const [one] = useKeys('ctrl + one');
  const [two] = useKeys('ctrl + two');
  const [three] = useKeys('ctrl + three');
  const [four] = useKeys('ctrl + four');
  const [all] = useKeys('ctrl + d');
  const [search, setSearch] = useState('');

  const searchDependencies = e => {
    setSearch(e.target.value);

    getExplorerDependencies(e.target.value);
  };

  useEffect(() => {
    if (one) {
      addDependency(explorerDependencies[0]);
    }
    if (two && explorerDependencies[1]) {
      addDependency(explorerDependencies[1]);
    }
    if (three && explorerDependencies[2]) {
      addDependency(explorerDependencies[2]);
    }
    if (four && explorerDependencies[3]) {
      addDependency(explorerDependencies[3]);
    }
    if (all) {
      modalOpened({ modal: 'searchDependencies' });
      setSearch('');
      clearExplorerDependencies();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four, all]);

  const addDependency = dependency => {
    addNpmDependency({
      name: dependency.name,
      version: dependency.tags.latest,
    });
    setSearch('');
    clearExplorerDependencies();
  };

  return (
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
  );
};
