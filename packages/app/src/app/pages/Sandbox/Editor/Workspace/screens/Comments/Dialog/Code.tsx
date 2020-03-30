import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight';

import nightOwl from 'prism-react-renderer/themes/nightOwl';
import { withTheme } from 'styled-components';

export const Code = withTheme(({ value, language, theme }) => (
  <>
    <Highlight
      {...defaultProps}
      code={value}
      language={language || 'js'}
      theme={theme.vscodeTheme.type === 'dark' ? nightOwl : nightOwlLight}
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
  </>
));
