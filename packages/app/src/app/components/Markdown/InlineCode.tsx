import React from 'react';
import { Text, Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const InlineCode = props => (
  <Element
    as="span"
    css={css({
      backgroundColor: 'grays.200',
      paddingX: '2px',
      borderRadius: 'small',
    })}
  >
    <Text
      css={css({
        color: 'reds.500',
      })}
      size={3}
      as="code"
    >
      {props.children}
    </Text>
  </Element>
);
