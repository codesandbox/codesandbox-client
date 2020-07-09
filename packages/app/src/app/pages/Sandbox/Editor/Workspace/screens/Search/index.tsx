import React, { useState, useEffect } from 'react';
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
import { useSearch } from './useSearch';
import { FileIcon } from './icons';
import EntryIcon from '../../Files/DirectoryEntry/Entry/EntryIcons';

export const Search = () => {
  const { actions, effects } = useOvermind();
  const [searchValue, setSearchValue] = useState('codesandbox');
  const results = useSearch(searchValue);

  const open = async (id, match) => {
    await actions.editor.moduleSelected({ id });
    const [parsedHead, parsedAnchor] = match;
    if (!isNaN(parsedHead) && !isNaN(parsedAnchor)) {
      effects.vscode.setSelection(parsedHead, parsedAnchor);
    }
  };

  return (
    <Collapsible defaultOpen title="Search">
      <Element padding={2} marginBottom={5}>
        <Input
          placeholder="Search"
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
        />
        <Element marginTop={4}>
          {results.map(file => (
            <ListAction
              onClick={() => open(file.id, file.matches[0])}
              paddingY={2}
              css={css({ display: 'block' })}
            >
              <Stack gap={2}>
                <EntryIcon type={getType(file.title)} />

                <Text block variant="muted" size={3}>
                  {file.title}
                </Text>
              </Stack>
              {file.matches.map(match => (
                <Stack gap={2} paddingLeft={4} paddingTop={2} align="center">
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
              ))}
            </ListAction>
          ))}
        </Element>
      </Element>
    </Collapsible>
  );
};
