import React, { FunctionComponent, useEffect } from 'react';
import {
  SidebarRow,
  Text,
  SearchInput,
  ListAction,
  Element,
} from '@codesandbox/components';
import OutsideClickHandler from 'react-outside-click-handler';
import css from '@styled-system/css';
import useKeys from 'react-use/lib/useKeyboardJs';
import { useOvermind } from 'app/overmind';

const buttonStyles = css({
  padding: 0,
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  color: 'inherit',
  width: '100%',
  paddingY: 2,
  justifyContent: 'space-between',

  ':focus': {
    outline: 'none',
  },
});
export const AddDependency: FunctionComponent<{ readonly?: boolean }> = () => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency },
      workspace: {
        getExplorerDependencies,
        clearExplorerDependencies,
        changeDependencySearch,
      },
    },
    state: {
      currentModal,
      workspace: { explorerDependencies, dependencySearch },
    },
  } = useOvermind();
  const modalOpen = currentModal === 'searchDependencies';
  const [one] = useKeys('ctrl + one');
  const [two] = useKeys('ctrl + two');
  const [three] = useKeys('ctrl + three');
  const [four] = useKeys('ctrl + four');
  const [all] = useKeys('ctrl + d');

  const searchDependencies = e => {
    changeDependencySearch(e.target.value);

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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [one, two, three, four, all]);

  const addDependency = dependency => {
    addNpmDependency({
      name: dependency.name,
      version: dependency.tags.latest,
    });
  };

  return (
    <SidebarRow
      css={css({ display: 'block', position: 'relative' })}
      marginX={2}
      marginBottom={2}
    >
      <SearchInput
        value={modalOpen ? '' : dependencySearch}
        onChange={searchDependencies}
        placeholder="Add npm dependency"
        css={css({
          width: '100%',
        })}
      />
      {!modalOpen && explorerDependencies.length ? (
        <OutsideClickHandler onOutsideClick={() => clearExplorerDependencies()}>
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
                key={dependency.objectID}
                justify="space-between"
                css={css({ color: 'sideBar.foreground' })}
              >
                <button
                  css={buttonStyles}
                  type="button"
                  onClick={() => addDependency(dependency)}
                >
                  <Text>{dependency.name}</Text>
                  <Text variant="muted">Ctrl + {i + 1}</Text>
                </button>
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
              })}
            >
              <button
                css={buttonStyles}
                type="button"
                onClick={() => {
                  modalOpened({ modal: 'searchDependencies' });
                }}
              >
                <Text>Show All</Text>
                <Text variant="muted">Ctrl + D</Text>
              </button>
            </ListAction>
          </Element>
        </OutsideClickHandler>
      ) : null}
    </SidebarRow>
  );
};
