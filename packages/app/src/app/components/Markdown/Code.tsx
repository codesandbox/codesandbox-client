import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import { useOvermind } from 'app/overmind';
import { withTheme } from 'styled-components';
import { makeTheme } from '@codesandbox/common/lib/utils/makeTheme';

export const Code = withTheme(({ value, language, theme }) => {
  const { state } = useOvermind();

  const defaultLanguage = () => {
    const template = state.editor.currentSandbox.template;
    if (template === 'create-react-app') {
      return 'jsx';
    }
    return 'js';
  };
  return value ? (
    <Highlight
      {...defaultProps}
      code={value}
      language={language || defaultLanguage()}
      // @ts-ignore
      theme={makeTheme(theme.vscodeTheme)}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Element
          as="pre"
          paddingX={4}
          paddingY={2}
          marginY={2}
          className={className}
          style={style}
          css={css({
            fontSize: 3,
            whiteSpace: 'pre-wrap',
            maxHeight: 400,
            overflow: 'scroll',
            fontFamily: "'dm', menlo, monospace",

            '*': {
              wordBreak: 'break-all',
            },
          })}
        >
          {tokens.map((line, i) => (
            <Element {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <Element as="span" {...getTokenProps({ token, key })} />
              ))}
            </Element>
          ))}
        </Element>
      )}
    </Highlight>
  ) : null;
});
