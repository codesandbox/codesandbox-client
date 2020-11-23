import { Element, Link, Text } from '@codesandbox/components';
import css from '@styled-system/css';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Code } from './Code';
import { Image } from './Image';
import { InlineCode } from './InlineCode';
import { LinkElement } from './Link';

export const Markdown = ({ source }) => (
  <Element
    css={css({
      'ul, ol': {
        paddingLeft: 0,
        fontSize: 13,
      },
      'ol li': {
        counterIncrement: 'counter',
      },
      'ol li::before': {
        color: 'mutedForeground',
        content: "counter(counter) '. '",
      },
      p: {
        margin: 0,
      },
      li: {
        listStyle: 'none',
      },
      'li:before': {
        content: "'•'",
        color: 'mutedForeground',
        paddingRight: '0.5em',
      },
    })}
  >
    <ReactMarkdown
      source={source ? source.replace(/\n/gi, '&nbsp;\n\n') : source}
      transformLinkUri={null}
      renderers={{
        text: ({ children }) => (
          <Text
            variant="muted"
            size={3}
            css={css({
              wordBreak: 'break-word',
            })}
          >
            {children}
          </Text>
        ),
        heading: ({ children }) => (
          <Text block variant="muted" size={3}>
            {children}
          </Text>
        ),
        blockquote: ({ children }) => (
          <Text
            block
            variant="muted"
            size={3}
            css={css({
              p: {
                display: 'inline',
              },
              ':before': { content: 'open-quote' },
              ':after': { content: 'close-quote' },
            })}
          >
            {children}
          </Text>
        ),
        code: Code,
        link: LinkElement,
        linkReference: props => <Link {...props}>{props.children}</Link>,
        image: Image,
        imageReference: Image,
        thematicBreak: () => null,
        inlineCode: InlineCode,
      }}
    />
  </Element>
);
