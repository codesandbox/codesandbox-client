import React, { useState, useEffect, useRef } from 'react';
import { VariableSizeList as List } from 'react-window';
import {
  Collapsible,
  Text,
  Element,
  Input,
  Button,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';

import css from '@styled-system/css';
import { Module } from '@codesandbox/common/lib/types';
import { Result } from './components/Result';
import SearchWorker from './search.worker';
import { TabButton } from './components/TabButton';
import { SearchOptions } from './components/SearchOptions';
import { MoreIcon, SearchIcon } from './icons';

import { FileFilters } from './components/FileFilters';

export enum OptionTypes {
  CaseSensitive = 'caseSensitive',
  Regex = 'regex',
  MatchFullWord = 'matchFullWord',
}

export type Options = {
  caseSensitive: boolean;
  regex: boolean;
  matchFullWord: boolean;
  filesToSearch: string;
  filesToExclude: string;
};

export const Search = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();
  const list = useRef<any>();
  const wrapper = useRef<any>();
  const [openFilesSearch, setOpenFilesSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filesToSearch, setFilesToSearch] = useState('');
  const [filesToExclude, setFilesToExclude] = useState('');
  const [results, setResults] = useState([]);
  const allModules = JSON.parse(JSON.stringify(currentSandbox.modules));
  const [modules, setModules] = useState<Module[]>(allModules);
  const [showFileFilters, setShowFileFilters] = useState(false);
  const [options, setOptions] = useState({
    [OptionTypes.CaseSensitive]: false,
    [OptionTypes.Regex]: false,
    [OptionTypes.MatchFullWord]: false,
  });

  const toggleSearch = (searchIsOpen: boolean) => {
    setOpenFilesSearch(searchIsOpen);

    if (searchIsOpen) {
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

  useEffect(() => {
    if (searchValue) {
      searchFiles(searchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options, filesToSearch, filesToExclude, openFilesSearch]);

  const searchCall = async ({ value, files }) => {
    if (searchWorker.current) {
      const val = await searchWorker.current.search(value, files, {
        ...options,
        filesToSearch,
        filesToExclude,
      });
      setResults(val);
      if (list.current) {
        list.current.resetAfterIndex(0);
      }
    }
  };

  const searchFiles = (value: string) => {
    if (value.length > 1) {
      searchCall({ value, files: modules });
    }

    if (!value) {
      setResults([]);
    }
  };

  const getHeight = (i: string) => 32 + results[i].matches.length * 26;

  const Row = ({ index, style }) => (
    <Element style={style}>
      <Result {...results[index]} />
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
        padding={2}
        marginBottom={5}
        css={{
          height: 'calc(100% - 16px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Element
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
              placeholder="Search"
              onChange={e => {
                setSearchValue(e.target.value);
                searchFiles(e.target.value);
              }}
            />
            <SearchOptions options={options} setOptions={setOptions} />
          </Element>
          <Button
            variant="secondary"
            autoWidth
            onClick={() => setShowFileFilters(exclude => !exclude)}
            css={css({
              color: showFileFilters
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

        <FileFilters
          setFilesToExclude={setFilesToExclude}
          setFilesToSearch={setFilesToSearch}
          showFileFilters={showFileFilters}
        />
        <Stack
          gap={2}
          paddingY={2}
          css={css({
            borderWidth: 1,
            borderStyle: 'solid',
            borderColor: 'sideBar.border',
            borderLeftWidth: 0,
            borderRightWidth: 0,
          })}
        >
          <TabButton
            active={!openFilesSearch}
            onClick={() => toggleSearch(false)}
          >
            Sandbox
          </TabButton>
          <TabButton
            active={openFilesSearch}
            onClick={() => toggleSearch(true)}
          >
            Open Files
          </TabButton>
        </Stack>
        {results.length ? (
          <Element
            paddingY={2}
            css={css({
              borderWidth: 1,
              borderStyle: 'solid',
              borderColor: 'sideBar.border',
              borderLeftWidth: 0,
              borderRightWidth: 0,
            })}
          >
            <Text block variant="muted" align="center">
              {results.reduce((acc, curr) => acc + curr.matches.length, 0)}{' '}
              results in {results.length} files
            </Text>
          </Element>
        ) : null}
        <Element
          ref={wrapper}
          marginTop={4}
          css={{ height: 'calc(100% - 16px)' }}
        >
          <List
            height={wrapper.current ? wrapper.current.clientHeight : 0}
            itemCount={results.length}
            itemSize={getHeight}
            width={wrapper.current ? wrapper.current.clientWidth : 0}
            ref={list}
          >
            {Row}
          </List>
        </Element>
      </Element>
    </Collapsible>
  );
};
