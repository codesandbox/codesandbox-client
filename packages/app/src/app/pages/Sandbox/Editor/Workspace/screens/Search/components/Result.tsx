import React from 'react';
import getType from 'app/utils/get-type';
import { Text, Element, ListAction, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import EntryIcon from '../../../Files/DirectoryEntry/Entry/EntryIcons';
import { ToggleIcon } from '../icons';

export const Result = ({ i, updateRender }) => {
  const {
    state: {
      workspace: { searchResults },
    },
    actions: { editor, workspace },
    effects: { vscode },
  } = useOvermind();
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
          background: 'transparent',
          color: 'inputOption.activeBorder',
          padding: 0,
          border: 'none',
          cursor: 'pointer',
          width: '100%',
          outline: 'none',
        })}
        onClick={() => {
          workspace.openResult(i);
          updateRender(i);
        }}
      >
        <Stack gap={2} paddingBottom={2} paddingTop={4} align="center">
          <Element
            css={css({
              transition: 'transform 100ms ease',
              transform: !open ? 'rotate(-90deg)' : 'rotate(0deg)',
            })}
          >
            <ToggleIcon />
          </Element>

          <EntryIcon type={getType(title)} />

          <Text block variant="muted" size={3}>
            {title}
          </Text>
        </Stack>
      </button>

      {open ? (
        <Element>
          {matches.map(match => (
            <ListAction css={css({ minHeight: '28px' })}>
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
                key={`${match[0]}-${match[1]}`}
                onClick={() => openFile(id, match)}
              >
                <Stack gap={2} align="center">
                  <Text block variant="muted" size={3}>
                    {code
                      .substring(match[0] - 10, match[0])
                      .split('\n')
                      .join(' ')}
                    <span
                      css={css({
                        background: 'rgba(251, 204, 67, 0.2)',
                      })}
                    >
                      {code.substring(match[0], match[1])}
                    </span>
                    {code
                      .substring(match[1], match[1] + 15)
                      .split('\n')
                      .join(' ')}
                  </Text>
                </Stack>
              </button>
            </ListAction>
          ))}
        </Element>
      ) : null}
    </Element>
  );
};
