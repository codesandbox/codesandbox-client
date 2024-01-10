import React, { FunctionComponent, useRef } from 'react';
import {
  SidebarRow,
  Button,
  Text,
  SearchInput,
  ListAction,
  Element,
} from '@codesandbox/components';
import css from '@styled-system/css';
import Downshift, { PropGetters } from 'downshift';
import { Dependency } from '@codesandbox/common/lib/types/algolia';
import { isPrivateScope } from 'app/utils/private-registry';

import { useAppState, useActions, useEffects } from 'app/overmind';
import { useKeyboard } from './useKeys';

const buttonStyles = css({
  color: 'inherit',
  justifyContent: 'space-between',
});

type AddDependencyResultListProps = {
  inputValue: string;
  explorerDependenciesEmpty: boolean;
  usedExplorerDependencies: ('OPEN_MODAL' | Dependency)[];
  highlightedIndex: number;
  getItemProps: PropGetters<unknown>['getItemProps'];
  addNpmDependency: (dep: { name: string; version: string }) => void;
};

const AddDependencyResultList = ({
  inputValue,
  explorerDependenciesEmpty,
  usedExplorerDependencies,
  highlightedIndex,
  getItemProps,
  addNpmDependency,
}: AddDependencyResultListProps) => {
  const state = useAppState();

  const isPrivateNpmScope =
    state.editor.currentSandbox &&
    isPrivateScope(state.editor.currentSandbox, inputValue);

  if (isPrivateNpmScope) {
    return (
      <ListAction
        css={css({
          color: 'sideBar.foreground',
          borderWidth: 0,
          borderTopWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'sideBar.border',
          padding: 3,
        })}
      >
        <Text
          css={css({
            maxWidth: '80%',
            margin: 'auto',
            lineHeight: 1.5,
          })}
          size={2}
          align="center"
          variant="muted"
        >
          This is a package from your npm registry, you can type the full name
          and press {'"'}Enter{'"'} to add it.
        </Text>
      </ListAction>
    );
  }

  if (explorerDependenciesEmpty) {
    return (
      <ListAction
        css={css({
          color: 'sideBar.foreground',
          borderWidth: 0,
          borderTopWidth: '1px',
          borderStyle: 'solid',
          borderColor: 'sideBar.border',
          padding: 3,
        })}
      >
        <Text
          css={css({
            maxWidth: '80%',
            margin: 'auto',
            lineHeight: 1.5,
          })}
          size={2}
          align="center"
          variant="muted"
        >
          It looks like there aren’t any matches for your query
        </Text>
      </ListAction>
    );
  }

  return (
    <>
      {usedExplorerDependencies.map((dependency, i) =>
        dependency === 'OPEN_MODAL' ? (
          <ListAction
            key="show-all"
            justify="space-between"
            isActive={highlightedIndex === i}
            css={css({
              color: 'sideBar.foreground',
              borderWidth: 0,
              borderTopWidth: '1px',
              borderStyle: 'solid',
              borderColor: 'sideBar.border',
            })}
            {...getItemProps({
              key: 'OPEN_MODAL',
              index: i,
              item: 'OPEN_MODAL',
            })}
          >
            <Button
              css={buttonStyles}
              tabIndex={0}
              variant="link"
              type="button"
            >
              <Text weight="400">Show All</Text>
              <Text variant="muted">Ctrl + D</Text>
            </Button>
          </ListAction>
        ) : (
          <ListAction
            key={dependency.objectID}
            justify="space-between"
            isActive={highlightedIndex === i}
            css={css({ color: 'sideBar.foreground' })}
            {...getItemProps({
              key: dependency.objectID,
              index: i,
              item: dependency,
            })}
          >
            <Button
              css={buttonStyles}
              variant="link"
              type="button"
              onClick={() => {
                addNpmDependency({
                  name: dependency.name,
                  version: dependency.tags?.latest,
                });
              }}
            >
              <Text maxWidth="80%" weight="400">
                {dependency._highlightResult ? (
                  <Text
                    css={css({
                      em: {
                        fontWeight: 'bold',
                        fontStyle: 'initial',
                      },
                    })}
                    dangerouslySetInnerHTML={{
                      __html: dependency._highlightResult.name?.value,
                    }}
                  />
                ) : (
                  dependency.name
                )}
              </Text>
              <Text variant="muted">Ctrl + {i + 1}</Text>
            </Button>
          </ListAction>
        )
      )}
    </>
  );
};

export const AddDependency: FunctionComponent<{ readonly?: boolean }> = () => {
  const {
    modalOpened,
    editor: { addNpmDependency },
    workspace: {
      getExplorerDependencies,
      clearExplorerDependencies,
      changeDependencySearch,
    },
  } = useActions();
  const effects = useEffects();
  const {
    currentModal,
    workspace: {
      explorerDependencies,
      explorerDependenciesEmpty,
      dependencySearch,
    },
  } = useAppState();
  const modalOpen = currentModal === 'searchDependencies';
  const searchInput = useRef();
  useKeyboard(searchInput);

  const searchDependencies = (inputValue: string) => {
    let value = inputValue;
    if (value.includes('@') && !value.startsWith('@')) {
      value = value.split('@')[0];
    }

    if (value.startsWith('@')) {
      // if it starts with one and has a version
      if (value.split('@').length === 3) {
        const part = value.split('@');
        value = `@${part[0]}${part[1]}`;
      }
    }

    changeDependencySearch(inputValue);
    getExplorerDependencies(value);
  };

  const onDependencySelect = dependency => {
    if (dependency === 'OPEN_MODAL') {
      modalOpened({ modal: 'searchDependencies' });
      clearExplorerDependencies();
    } else if (dependency?.name) {
      if (dependency.tags) {
        addNpmDependency({
          name: dependency.name,
          version: dependency.tags?.latest,
        });
      } else {
        effects.notificationToast.error(
          `There has been a problem installing ${dependency.name}. No installable version found`
        );
      }
      clearExplorerDependencies();
      changeDependencySearch('');
    }
  };

  const usedExplorerDependencies = [
    ...explorerDependencies,
    'OPEN_MODAL' as const,
  ];

  return (
    <Downshift
      onSelect={onDependencySelect}
      itemToString={dependency => {
        if (dependency === 'OPEN_MODAL') {
          return 'OPEN_MODAL';
        }
        return dependency ? dependency.objectID : '';
      }}
      inputValue={dependencySearch}
      onInputValueChange={inputValue => {
        if (inputValue !== 'OPEN_MODAL') {
          searchDependencies(inputValue);
        }
      }}
    >
      {({
        getInputProps,
        getItemProps,
        getMenuProps,
        isOpen,
        inputValue,
        highlightedIndex,
        getRootProps,
      }) => {
        const open =
          !modalOpen &&
          (explorerDependencies.length || explorerDependenciesEmpty) &&
          isOpen &&
          inputValue &&
          !inputValue.startsWith('https://') &&
          !inputValue.startsWith('http://');
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
                  flexGrow: 1,
                })}
                {...getRootProps(
                  { refKey: 'innerRef' },
                  { suppressRefError: true }
                )}
              >
                <SearchInput
                  ref={searchInput}
                  value={modalOpen ? '' : inputValue}
                  placeholder="Add Dependency"
                  onFocus={() => {
                    if (inputValue) {
                      getExplorerDependencies(inputValue);
                    }
                  }}
                  {...getInputProps()}
                />
              </Element>
              <Button
                variant="secondary"
                css={css({
                  width: 26,
                  height: 26,
                  padding: 0,
                  border: '1px solid',
                  borderColor: 'input.border',
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

            {open ? (
              <Element css={css({ position: 'relative' })}>
                <Element
                  as="ul"
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
                    fontWeight: 500,
                  })}
                  {...getMenuProps()}
                  id="list"
                >
                  <AddDependencyResultList
                    inputValue={inputValue}
                    explorerDependenciesEmpty={explorerDependenciesEmpty}
                    usedExplorerDependencies={usedExplorerDependencies}
                    highlightedIndex={highlightedIndex}
                    getItemProps={getItemProps}
                    addNpmDependency={addNpmDependency}
                  />
                </Element>
              </Element>
            ) : null}
          </>
        );
      }}
    </Downshift>
  );
};
