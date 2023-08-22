import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text, ITextProps } from '../Text';

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  React.AnchorHTMLAttributes<HTMLSpanElement> &
  ITextProps & {
    as?: any;
    to?: string;
  };

const LinkElement = styled(Text).attrs(p => ({
  as: ((p as unknown) as { as: string }).as || 'a',
}))<LinkProps>(
  css({
    color: '#999',
    textDecoration: 'none',
    transition: 'color ease',
    transitionDuration: theme => theme.speeds[2],
    ':hover, :focus': {
      color: '#C2C2C2',
    },
  })
);

export const Link: React.FC<LinkProps> = props => (
  <LinkElement
    rel={props.target === '_blank' ? 'noopener noreferrer' : null}
    as="a"
    {...props}
  />
);
