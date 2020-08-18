import React, { useState, useEffect, useCallback } from 'react';
import {
  Collapsible,
  Text,
  Element,
  Input,
  ListAction,
  Stack,
} from '@codesandbox/components';
import { useOvermind } from 'app/overmind';
import getType from 'app/utils/get-type';
import css from '@styled-system/css';
import { useWorker } from '@koale/useworker';
import { Module } from '@codesandbox/common/lib/types';
import { FileIcon } from './icons';
import EntryIcon from '../../Files/DirectoryEntry/Entry/EntryIcons';
import { TabButton } from './components/TabButton';

const search = (term: string, modules: Module[]) => {
  const searchable = modules.map(m => ({
    ...m,
    matches: [],
  }));
  function String2Regex(s) {
    const one = s.match(/\/(.+)\/.*/);
    const two = s.match(/\/.+\/(.*)/);

    if (one && two) {
      return new RegExp(s.match(/\/(.+)\/.*/)[1], s.match(/\/.+\/(.*)/)[1]);
    }

    return s;
  }

  function getAllMatches(text: string, searchTerm: string) {
    const searchStrLen = term.length;
    if (searchStrLen === 0) {
      return [];
    }
    let pointer = 0;
    let index = text.substring(pointer).search(searchTerm);
    const indices = [];

    while (index > -1) {
      indices.push([pointer + index, pointer + index + searchStrLen]);
      pointer += index + searchStrLen;
      index = text.substring(pointer).search(searchTerm);
    }
    return indices;
  }

  if (term && modules) {
    return searchable
      .map(file => {
        const s = file.code
          .toLocaleLowerCase()
          .search(String2Regex(term.toLowerCase()));
        if (s !== -1) {
          const str = file.code.toLocaleLowerCase();
          const searchTerm = String2Regex(term.toLowerCase());
          const matches = getAllMatches(str, searchTerm);
          return {
            code: file.code,
            id: file.id,
            path: file.path,
            title: file.title,
            matches,
          };
        }

        return false;
      })
      .filter(exists => exists);
  }

  return [];
};

export const Search = () => {
  const {
    actions,
    effects,
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();
  const [openFilesSearch, setOpenFilesSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [searchWorker, { status: workerStatus, kill: killWorker }] = useWorker(
    search
  );
  const [queue, setQueue] = useState([]);
  const allModules = JSON.parse(JSON.stringify(currentSandbox.modules));
  const [modules, setModules] = useState(allModules);

  const toggleSearch = searchInOpen => {
    setOpenFilesSearch(searchInOpen);

    if (searchInOpen) {
      const openFiles = (
        window.CSEditor?.editor?.editorService?.editors || []
      ).map(file => file.name);

      setModules(allModules.filter(file => openFiles.includes(file.title)));
    } else {
      setModules(allModules);
    }
  };

  useEffect(() => {
    if (searchTerm && modules) {
      searchFiles(searchTerm);
    }
  }, [modules, searchFiles, searchTerm]);

  const open = async (id, match) => {
    await actions.editor.moduleSelected({ id });
    const [parsedHead, parsedAnchor] = match;
    if (!isNaN(parsedHead) && !isNaN(parsedAnchor)) {
      effects.vscode.setSelection(parsedHead, parsedAnchor);
    }
  };

  useEffect(() => {
    if (workerStatus !== 'RUNNING' && queue.length) {
      while (queue.length > 0) {
        const current = queue.shift();

        searchWorker(current.value, current.files).then(files => {
          killWorker();
          setResults(files);
        });
      }
    }
  }, [workerStatus, queue.length, queue, searchWorker, killWorker]);

  const searchFiles = useCallback(
    async value => {
      setSearchTerm(value);
      setQueue(q =>
        q.concat({ value, files: JSON.parse(JSON.stringify(modules)) })
      );
    },
    [modules]
  );

  return (
    <Collapsible defaultOpen title="Search">
      <Element padding={2} marginBottom={5}>
        <Input
          marginBottom={4}
          placeholder="Search"
          onChange={e => searchFiles(e.target.value)}
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

        <Element marginTop={4}>
          {results.map(file => (
            <ListAction paddingY={2} css={css({ display: 'block' })}>
              <Stack gap={2}>
                <EntryIcon type={getType(file.title)} />

                <Text block variant="muted" size={3}>
                  {file.title}
                </Text>
              </Stack>
              <Element>
                {file.matches.map(match => (
                  <button
                    type="button"
                    css={css({
                      '-webkit-appearance': 'none',
                      border: 'none',
                      background: 'transparent',
                      display: 'block',
                      width: '100%',
                      cursor: 'pointer',
                    })}
                    onClick={() => open(file.id, match)}
                  >
                    <Stack
                      gap={2}
                      paddingLeft={4}
                      paddingTop={2}
                      align="center"
                    >
                      <FileIcon />

                      <Text block variant="muted" size={3}>
                        {file.code.substring(match[0] - 5, match[0])}
                        <span
                          css={css({
                            background: 'rgba(251, 204, 67, 0.2)',
                          })}
                        >
                          {file.code.substring(match[0], match[1])}
                        </span>
                        {file.code.substring(match[1], match[1] + 5)}
                      </Text>
                    </Stack>
                  </button>
                ))}
              </Element>
            </ListAction>
          ))}
        </Element>
      </Element>
    </Collapsible>
  );
};
