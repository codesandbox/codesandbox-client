import React from 'react';
import getType from 'app/utils/get-type';
import { Text, Element, ListAction, Stack } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { FileIcon } from '../icons';
import EntryIcon from '../../../Files/DirectoryEntry/Entry/EntryIcons';

export const Result = ({ id, title, matches, code }) => {
  const {
    actions: { editor },
    effects: { vscode },
  } = useOvermind();

  const open = async (selectedFileId: string, match: [number, number]) => {
    await editor.moduleSelected({ id: selectedFileId });
    const [parsedHead, parsedAnchor] = match;
    if (!isNaN(parsedHead) && !isNaN(parsedAnchor)) {
      vscode.setSelection(parsedHead, parsedAnchor);
    }
  };

  return (
    <ListAction key={id} paddingY={2} css={css({ display: 'block' })}>
      <Stack gap={2}>
        <EntryIcon type={getType(title)} />

        <Text block variant="muted" size={3}>
          {title}
        </Text>
      </Stack>
      <Element>
        {matches.map(match => (
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
            onClick={() => open(id, match)}
          >
            <Stack gap={2} paddingLeft={4} paddingTop={2} align="center">
              <FileIcon />

              <Text block variant="muted" size={3}>
                {code.substring(match[0] - 5, match[0])}
                <span
                  css={css({
                    background: 'rgba(251, 204, 67, 0.2)',
                  })}
                >
                  {code.substring(match[0], match[1])}
                </span>
                {code.substring(match[1], match[1] + 5)}
              </Text>
            </Stack>
          </button>
        ))}
      </Element>
    </ListAction>
  );
};
