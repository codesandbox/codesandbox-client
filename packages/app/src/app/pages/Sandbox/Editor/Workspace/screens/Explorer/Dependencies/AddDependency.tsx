import React, { FunctionComponent, useRef } from 'react';
import {
  SidebarRow,
  Button,
  Text,
  SearchInput,
  ListAction,
  Element
} from '@codesandbox/components';
import OutsideClickHandler from 'react-outside-click-handler';
import css from '@styled-system/css';

import { useOvermind } from 'app/overmind';
import { useKeyboard } from './useKeys';

const buttonStyles = css({
  color: 'inherit',
  justifyContent: 'space-between'
});

export const AddDependency: FunctionComponent<{ readonly?: boolean }> = () => {
  const {
    actions: {
      modalOpened,
      editor: { addNpmDependency },
      workspace: {
        getExplorerDependencies,
        clearExplorerDependencies,
        changeDependencySearch
      }
    },
    state: {
      currentModal,
      workspace: { explorerDependencies, dependencySearch }
    }
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
    <>
      <SidebarRow
        css={css({ position: 'relative' })}
        gap={1}
        marginX={2}
        marginBottom={2}
      >
        <Element
          css={css({
            width: '100%',
            flexGrow: 1
          })}
        >
          <SearchInput
            ref={searchInput}
            value={modalOpen ? '' : dependencySearch}
            onChange={searchDependencies}
            placeholder="Add Dependency"
            onFocus={() => {
              if (dependencySearch) {
                getExplorerDependencies(dependencySearch);
              }
            }}
          />
        </Element>
        <Button
          variant="secondary"
          css={css({
            width: 6,
            height: 6,
            backgroundColor: 'inputOption.activeBorder',
            padding: 0,
            border: '1px solid',
            borderColor: 'input.border'
          })}
          onClick={() => modalOpened({ modal: 'searchDependencies' })}
        >
          <svg width={24} height={24} fill="none" viewBox="0 0 24 24">
            <path
              css={css({ fill: 'tab.inactiveForeground' })}
              fillRule="evenodd"
              d="M18 7.5a.5.5 0 00-.5-.5h-11a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-1zm-12 4a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-1zm0 4a.5.5 0 01.5-.5h11a.5.5 0 01.5.5v1a.5.5 0 01-.5.5h-11a.5.5 0 01-.5-.5v-1z"
              clipRule="evenodd"
            />
          </svg>
        </Button>
      </SidebarRow>

      {!modalOpen && explorerDependencies.length ? (
        <OutsideClickHandler onOutsideClick={() => clearExplorerDependencies()}>
          <Element
            as="ul"
            ref={list}
            padding={0}
            marginX={2}
            css={css({
              backgroundColor: 'sideBar.background',
              position: 'absolute',
              zIndex: 10,
              width: 'calc(100% - 16px)',
              borderRadius: 'medium',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'sideBar.border',
              marginTop: '-6px',
              fontWeight: 500
            })}
          >
            {explorerDependencies.map((dependency, i) => (
              <ListAction
                key={dependency.objectID}
                justify="space-between"
                css={css({ color: 'sideBar.foreground' })}
              >
                <Button
                  css={buttonStyles}
                  variant="link"
                  type="button"
                  onClick={() =>
                    addNpmDependency({
                      name: dependency.name,
                      version: dependency.tags.latest
                    })
                  }
                >
                  <Text
                    css={css({
                      maxWidth: '80%'
                    })}
                  >
                    {dependency.name}
                  </Text>
                  <Text variant="muted">Ctrl + {i + 1}</Text>
                </Button>
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
                borderColor: 'sideBar.border'
              })}
            >
              <Button
                css={buttonStyles}
                tabIndex={0}
                variant="link"
                type="button"
                onClick={() => {
                  modalOpened({ modal: 'searchDependencies' });
                }}
              >
                <Text>Show All</Text>
                <Text variant="muted">Ctrl + D</Text>
              </Button>
            </ListAction>
          </Element>
        </OutsideClickHandler>
      ) : null}
    </>
  );
};
