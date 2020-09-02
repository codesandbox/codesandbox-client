import React, { FunctionComponent, useRef } from 'react';
import {
  SidebarRow,
  Text,
  SearchInput,
  ListAction,
  Element,
} from '@codesandbox/components';
import OutsideClickHandler from 'react-outside-click-handler';
import css from '@styled-system/css';

import { useOvermind } from 'app/overmind';
import { useKeyboard } from './useKeys';

const buttonStyles = css({
  padding: 0,
  appearance: 'none',
  border: 'none',
  background: 'transparent',
  display: 'flex',
  alignItems: 'center',
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
  const list = useRef();
  const searchInput = useRef();
  useKeyboard(list, searchInput);

  const searchDependencies = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeDependencySearch(e.target.value);
    getExplorerDependencies(e.target.value);
  };

  return (
    <SidebarRow
      css={css({ display: 'block', position: 'relative' })}
      marginX={2}
      marginBottom={2}
    >
      <SearchInput
        ref={searchInput}
        value={modalOpen ? '' : dependencySearch}
        onChange={searchDependencies}
        placeholder="Add npm dependency"
        css={css({
          width: '100%',
        })}
        onFocus={() => {
          if (dependencySearch) {
            getExplorerDependencies(dependencySearch);
          }
        }}
      />
      {!modalOpen && explorerDependencies.length ? (
        <OutsideClickHandler onOutsideClick={() => clearExplorerDependencies()}>
          <Element
            as="ul"
            ref={list}
            padding={0}
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
                  onClick={() =>
                    addNpmDependency({
                      name: dependency.name,
                      version: dependency.tags.latest,
                    })
                  }
                >
                  <Text
                    css={css({
                      maxWidth: '80%',
                    })}
                  >
                    {dependency.name}
                  </Text>
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
                tabIndex={0}
                css={buttonStyles}
                type="button"
                onClick={() => {
                  modalOpened({ modal: 'searchDependencies' });
                }}
              >
                <Text>Open dependency search</Text>
                <Text variant="muted">Ctrl + D</Text>
              </button>
            </ListAction>
          </Element>
        </OutsideClickHandler>
      ) : null}
    </SidebarRow>
  );
};
