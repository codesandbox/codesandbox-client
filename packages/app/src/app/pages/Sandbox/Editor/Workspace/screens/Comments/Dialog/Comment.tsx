import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Text, Element } from '@codesandbox/components';
import { Code } from './Code';

export const Comment = ({ source }) => (
  <Element paddingX={4} paddingBottom={6}>
    <ReactMarkdown
      source={source}
      renderers={{
        text: ({ children }) => (
          <Text variant="muted" size={13}>
            {children}
          </Text>
        ),
        heading: ({ children }) => (
          <Text variant="muted" size={13}>
            {children}
          </Text>
        ),
        code: props => <Code {...props} />,
      }}
    />
  </Element>
);
