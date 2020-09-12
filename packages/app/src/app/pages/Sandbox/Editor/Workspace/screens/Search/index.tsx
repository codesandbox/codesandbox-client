import React, { useState, useEffect, useRef } from 'react';
import {
  Collapsible,
  Text,
  Element,
  Input,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import css from '@styled-system/css';
import { Module } from '@codesandbox/common/lib/types';
import { Result } from './components/Result';
import SearchWorker from './search.worker.ts';
import { TabButton } from './components/TabButton';
import { SearchOptions } from './components/SearchOptions';
import { OptionTypes } from './search';

export const Search = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();
  const [openFilesSearch, setOpenFilesSearch] = useState(false);
  const [results, setResults] = useState([]);
  const allModules = JSON.parse(JSON.stringify(currentSandbox.modules));
  const [modules, setModules] = useState<Module[]>(allModules);
  const [options, setOptions] = useState({
    [OptionTypes.CaseSensitive]: false,
    [OptionTypes.Regex]: false,
    [OptionTypes.MathFullWord]: false,
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

  const searchWorker = useRef();

  const createWorker = async () => {
    searchWorker.current = await new SearchWorker();
  };

  useEffect(() => {
    createWorker();
    return () => {
      if (searchWorker.current) {
        searchWorker.current.terminate();
      }
    };
  }, []);

  const searchCall = async data => {
    if (searchWorker.current) {
      const val = await searchWorker.current.search(data.value, data.files);
      setResults(val);
    }
  };

  const searchFiles = value => {
    searchCall({ value, files: JSON.parse(JSON.stringify(modules)) });
  };

  // useEffect(() => {
  //   if (workerStatus !== 'RUNNING' && queue.length) {
  //     while (queue.length > 0) {
  //       const current = queue.shift();
  //
  //       searchWorker(current.value, current.files).then(files => {
  //         killWorker();
  //         setResults(files);
  //       });
  //     }
  //   }
  // }, [workerStatus, queue.length, queue, searchWorker, killWorker]);

  return (
    <Collapsible defaultOpen title="Search">
      <Element padding={2} marginBottom={5}>
        <Element
          css={css({
            position: 'relative',
          })}
        >
          <Input
            marginBottom={4}
            css={css({
              paddingRight: '50px',
            })}
            placeholder="Search"
            onChange={e => searchFiles(e.target.value)}
          />
          <SearchOptions options={options} setOptions={setOptions} />
        </Element>
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

        <Element marginTop={4}>
          {results.map(file => (
            <Result {...file} />
          ))}
        </Element>
      </Element>
    </Collapsible>
  );
};
