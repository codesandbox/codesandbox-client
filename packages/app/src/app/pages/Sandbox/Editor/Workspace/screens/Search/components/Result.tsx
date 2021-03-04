import React from 'react';
import { getType } from 'app/utils/get-type';
import { Text, Element, ListAction, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useActions, useAppState, useEffects } from 'app/overmind';
import { EntryIcons } from '../../../Files/DirectoryEntry/Entry/EntryIcons';
import { ToggleIcon } from '../icons';

export const Result = ({ i, updateRender }) => {
  const {
    workspace: { searchResults },
  } = useAppState();
  const { editor, workspace } = useActions();
  const { vscode } = useEffects();
  const { id, title, matches, code, open } = searchResults[i];

  const openFile = async (selectedFileId: string, match: [number, number]) => {
    await editor.moduleSelected({ id: selectedFileId });
    const [parsedHead, parsedAnchor] = match;
    if (!isNaN(parsedHead) && !isNaN(parsedAnchor)) {
      vscode.setSelection(parsedHead, parsedAnchor);
    }
  };

  return (
    <Element key={id} paddingY={2} css={css({ display: 'block' })}>
      <button
        type="button"
        css={css({
          color: 'mutedForeground',
          background: 'transparent',
          padding: 0,
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          paddingLeft: 2,
          ':hover': {
            color: 'sideBar.foreground',
          },
        })}
        onClick={() => {
          workspace.openResult(i);
          updateRender(i);
        }}
      >
        <Stack gap={2} paddingY={1} align="center">
          <Element
            css={css({
              color: 'inputOption.activeBorder',
              transition: 'transform 100ms ease',
              transform: !open ? 'rotate(-90deg)' : 'rotate(0deg)',
            })}
          >
            <ToggleIcon />
          </Element>

          <EntryIcons type={getType(title)} />

          <Text block size={3}>
            {title}
          </Text>
        </Stack>
      </button>

      {open ? (
        <Element>
          {matches.map(match => {
            const firstPart = code
              .substring(match[0] - 40, match[0])
              .split('\n');
            const secondPart = code
              .substring(match[1], match[1] + 100)
              .split('\n');
            return (
              <ListAction css={css({ minHeight: '28px' })}>
                <button
                  type="button"
                  css={css({
                    paddingLeft: 4,
                    '-webkit-appearance': 'none',
                    border: 'none',
                    background: 'transparent',
                    display: 'block',
                    width: '100%',
                    cursor: 'pointer',
                    color: 'mutedForeground',

                    ':hover': {
                      color: 'sideBar.foreground',
                    },
                  })}
                  key={`${match[0]}-${match[1]}`}
                  onClick={() => openFile(id, match)}
                >
                  <Stack gap={2} align="center">
                    <Text
                      block
                      size={3}
                      css={css({
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      })}
                    >
                      {firstPart[firstPart.length - 1]}
                      <span
                        css={css({
                          background: 'rgba(251, 204, 67, 0.2)',
                        })}
                      >
                        {code.substring(match[0], match[1])}
                      </span>
                      {secondPart[0]}
                    </Text>
                  </Stack>
                </button>
              </ListAction>
            );
          })}
        </Element>
      ) : null}
    </Element>
  );
};
