import React from 'react';
import css from '@styled-system/css';
import { Text, TextProps } from '../Text';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.AnchorHTMLAttributes<HTMLSpanElement> &
  TextProps;

export const Link: React.FC<LinkProps> = props => (
  <Text
    as="a"
    rel={props.target === '_blank' ? 'noopener noreferrer' : null}
    css={css({
      cursor: 'pointer',
      textDecoration: 'none',
      transition: 'color ease',
      transitionDuration: theme => theme.speeds[2],
      ':hover, :focus': {
        color: 'foreground',
      },
    })}
    {...props}
  />
);
