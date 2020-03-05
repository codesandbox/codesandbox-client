import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Text, Element, Link } from '@codesandbox/components';
import css from '@styled-system/css';
import { Code } from './Code';

const image = props => (
  <img
    {...props}
    alt={props.alt}
    css={css({
      maxWidth: '100%',
    })}
  />
);

export const Comment = ({ source }) => (
  <Element
    paddingX={4}
    paddingBottom={6}
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
      source={source}
      renderers={{
        text: ({ children }) => (
          <Text variant="muted" size={13}>
            {children}
          </Text>
        ),
        heading: ({ children }) => (
          <Text block variant="muted" size={13}>
            {children}
          </Text>
        ),
        code: props => <Code {...props} />,
        link: props => <Link {...props}>{props.children}</Link>,
        linkReference: props => <Link {...props}>{props.children}</Link>,
        image: props => image(props),
        thematicBreak: () => null,
        imageReference: props => image(props),
      }}
    />
  </Element>
);
