import { useTheme } from 'styled-components';
import css from '@styled-system/css';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { makeTheme } from '@codesandbox/common/lib/utils/makeTheme';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import { useOvermind } from 'app/overmind';
import { Element, Button, Stack } from '@codesandbox/components';
import React, { FunctionComponent, useEffect, useRef } from 'react';
import { Alert } from '../Common/Alert';

export const EditPresets: FunctionComponent = () => {
  const {
    actions: { preview: previewActions, modalClosed },
    state: {
      preview: { responsive },
    },
  } = useOvermind();
  const newPresets = useRef();
  const theme = useTheme();

  const savePresets = () => {
    if (!newPresets.current) return;

    // @ts-ignore
    const text = newPresets.current.textContent;

    try {
      const data = JSON.parse(text);
      previewActions.toggleEditPresets();
      previewActions.editPresets(data);
      modalClosed();
    } catch (e) {
      // aaaaa
    }
  };
  const listenForEsc = e => {
    if (e.keyCode === ESC) {
      modalClosed();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', listenForEsc);

    return () => window.removeEventListener('keydown', listenForEsc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Alert title="Add custom preset">
      <Element
        marginTop={4}
        css={css({
          pre: {
            'font-family': "'dm', menlo, monospace",
            fontSize: 15,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            height: '100%',
          },

          'pre:focus': {
            outline: 'none',
          },
        })}
      >
        <Highlight
          {...defaultProps}
          code={JSON.stringify(responsive.presets, null, 2)}
          language="json"
          // @ts-ignore
          theme={makeTheme(theme.vscodeTheme)}
        >
          {({ className, style, tokens, getLineProps, getTokenProps }) => (
            <Element
              contentEditable
              ref={newPresets}
              as="pre"
              paddingX={4}
              paddingY={2}
              marginY={2}
              className={className}
              style={style}
            >
              {tokens.map((line, i) => (
                <Element {...getLineProps({ line, key: i })}>
                  <Element
                    css={css({
                      display: 'inline',
                      '&:before': {
                        content: i.toString(),
                        fontSize: 3,
                        color: 'sideBar.border',
                        userSelect: 'none',
                      },
                    })}
                    paddingRight={3}
                  />
                  {line.map((token, key) => (
                    <Element as="span" {...getTokenProps({ token, key })} />
                  ))}
                </Element>
              ))}
            </Element>
          )}
        </Highlight>
        <Stack justify="flex-end" marginTop={11} gap={2}>
          <Button onClick={modalClosed} variant="link" autoWidth type="button">
            Cancel
          </Button>
          <Button
            autoWidth
            type="submit"
            // @ts-ignore
            disabled={!newPresets.current || !newPresets.current.textContent}
            onClick={savePresets}
          >
            Edit Presets
          </Button>
        </Stack>
      </Element>
    </Alert>
  );
};
