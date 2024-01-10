import React, { useState, useEffect, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Collapsible,
  Text,
  Element,
  Input,
  Button,
  Stack,
} from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';

import css from '@styled-system/css';
import { Module } from '@codesandbox/common/lib/types';
import { Result } from './components/Result';
import SearchWorker from './search.worker';
import { TabButton } from './components/TabButton';
import { SearchOptions } from './components/SearchOptions';
import { MoreIcon, SearchIcon } from './icons';

import { FileFilters } from './components/FileFilters';

export const Search = () => {
  const {
    user,
    editor: { currentSandbox },
    workspace: { searchValue, searchResults, searchOptions },
  } = useAppState();
  const {
    workspace: {
      searchValueChanged,
      searchResultsChanged,
      searchOptionsToggled,
    },
  } = useActions();
  const list = useRef<any>();
  const allModules = JSON.parse(JSON.stringify(currentSandbox.modules));
  const [modules, setModules] = useState<Module[]>(allModules);
  const [loading, setLoading] = useState(false);

  const toggleSearch = () => {
    searchOptionsToggled('openFilesSearch');

    if (searchOptions.openFilesSearch) {
      const openFiles = (
        window.CSEditor?.editor?.editorService?.editors || []
      ).map(file => file.name);
      setModules(
        allModules.filter((file: Module) => openFiles.includes(file.title))
      );
    } else {
      setModules(allModules);
    }
  };

  const searchWorker = useRef<any>();

  const createWorker = async () => {
    searchWorker.current = await new SearchWorker();
  };

  useEffect(() => {
    createWorker();
  }, []);

  const searchFiles = async (value: string) => {
    if (value.length > 1) {
      if (searchWorker.current) {
        setLoading(true);
        const currentResults = await searchWorker.current.search(
          value,
          modules,
          {
            ...searchOptions,
          }
        );
        setLoading(false);
        searchResultsChanged(
          currentResults.map((res, i) => {
            if (i < 2) {
              return {
                ...res,
                open: true,
              };
            }

            return res;
          })
        );

        if (list.current) {
          list.current.resetAfterIndex(0);
        }
      }
    } else {
      searchResultsChanged([]);
    }
  };

  useEffect(() => {
    searchFiles(searchValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...Object.values(searchOptions), searchValue]);
  const getItemSize = i => {
    if (searchResults[i].open) {
      return 32 + searchResults[i].matches.length * 28;
    }

    return 32;
  };
  const Row = ({ index, style }) => (
    <Element style={style}>
      <Result
        i={index}
        updateRender={(i: number) => list.current.resetAfterIndex(i)}
      />
    </Element>
  );

  return (
    <Collapsible
      defaultOpen
      title="Search"
      css={css({
        height: '100%',
        'div[open]': {
          height: 'calc(100% - 36px)',
          overflow: 'hidden',
          paddingBottom: 0,
          borderBottom: 'none',
        },
      })}
    >
      <Element
        paddingY={2}
        marginBottom={5}
        css={{
          height: 'calc(100% - 16px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Element
          paddingX={2}
          css={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: '1fr 26px',
            gridGap: 2,
          }}
        >
          <Element
            css={css({
              position: 'relative',
            })}
          >
            <SearchIcon />
            <Input
              marginBottom={4}
              css={css({
                paddingRight: '50px',
                paddingLeft: '30px',
              })}
              value={searchValue}
              placeholder="Search"
              onChange={e => searchValueChanged(e.target.value)}
            />
            <SearchOptions />
          </Element>
          <Button
            variant="secondary"
            autoWidth
            onClick={() => searchOptionsToggled('showFileFilters')}
            css={css({
              color: searchOptions.showFileFilters
                ? 'sideBar.foreground'
                : 'tab.inactiveForeground',

              ':hover:not(:disabled)': {
                color: 'sideBar.foreground',
              },

              ':focus:not(:disabled)': {
                outline: 'none',
              },
            })}
          >
            <MoreIcon />
          </Button>
        </Element>
        {searchOptions.showFileFilters ? <FileFilters /> : null}
        <Stack
          gap={2}
          padding={2}
          css={css({
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'sideBar.border',
            borderLeftWidth: 0,
            borderRightWidth: 0,
          })}
        >
          <TabButton
            active={!searchOptions.openFilesSearch}
            onClick={toggleSearch}
          >
            Sandbox
          </TabButton>
          <TabButton
            active={searchOptions.openFilesSearch}
            onClick={toggleSearch}
          >
            Open Files
          </TabButton>
        </Stack>
        {searchResults.length ? (
          <Element
            padding={2}
            css={css({
              borderWidth: 0,
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderColor: 'sideBar.border',
            })}
          >
            <Text block align="center">
              {searchResults.reduce(
                // @ts-ignore
                (acc, curr) => acc + curr.matches.length,
                0
              )}{' '}
              results in {searchResults.length} files
            </Text>
          </Element>
        ) : null}
        <Element marginTop={4} css={{ height: 'calc(100% - 16px)' }}>
          {searchResults.length && searchValue ? (
            <AutoSizer>
              {({ height, width }) => (
                <List
                  height={user ? height : height - 140}
                  width={width}
                  itemCount={searchResults.length}
                  itemSize={getItemSize}
                  ref={list}
                >
                  {Row}
                </List>
              )}
            </AutoSizer>
          ) : null}
          {!searchResults.length && searchValue.length > 1 && !loading && (
            <Stack justify="center" marginTop={10}>
              <Text variant="muted">No results found</Text>
            </Stack>
          )}
        </Element>
      </Element>
    </Collapsible>
  );
};
