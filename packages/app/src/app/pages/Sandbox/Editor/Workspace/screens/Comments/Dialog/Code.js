import React from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { Element } from '@codesandbox/components';
import nightOwlLight from 'prism-react-renderer/themes/nightOwlLight';

export const Code = props => (
  <>
    <Highlight
      {...defaultProps}
      code={props.value}
      language={props.language || 'js'}
      theme={nightOwlLight}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Element
          as="pre"
          paddingX={4}
          paddingY={2}
          marginY={2}
          className={className}
          style={style}
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
);
