import React from 'react';
import css from '@styled-system/css';
import { Element, Text } from '@codesandbox/components';

type Props = {
  title?: any;
  white?: boolean;
  children: any;
};

export const Box = ({ title, white, children }: Props) => (
  <Element
    padding={6}
    css={css({
      backgroundColor: white ? 'white' : 'grays.800',
      borderColor: 'grays.600',
      borderWidth: 1,
      borderStyle: 'solid',
    })}
  >
    {title ? (
      <Text
        css={css({ color: white ? 'grays.800' : 'inherit' })}
        weight="bold"
        block
        marginBottom={4}
        size={6}
      >
        {title}
      </Text>
    ) : null}
    {children}
  </Element>
);
