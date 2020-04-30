import React from 'react';
import css from '@styled-system/css';
import { Link as LinkBase, Text as TextBase } from '@codesandbox/components';

type TextProps = {
  children: any;
  white?: boolean;
  block?: boolean;
  marginBottom?: number;
  weight?: string;
  size?: number;
};

export const Link = ({ href, children }) => (
  <LinkBase size={3} css={css({ color: 'button.background' })} href={href}>
    {children}
  </LinkBase>
);

export const Text = ({ children, white, ...props }: TextProps) => (
  <TextBase
    size={3}
    block
    marginBottom={2}
    css={css({
      color: white ? 'grays.800' : 'inherit',
      lineHeight: white ? 1.5 : 'auto',
    })}
    {...props}
  >
    {children}
  </TextBase>
);
