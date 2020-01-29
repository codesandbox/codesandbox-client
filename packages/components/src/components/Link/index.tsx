import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Text } from '../Text';

interface ILinkProps {
  href: string;
  target?: string;
  rel?: string;
  variant?: 'body' | 'muted' | 'danger'; // from Text
}

const LinkElement = styled(Text).attrs({ as: 'a' })<ILinkProps>(
  css({
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover, :focus': {
      color: 'foreground',
    },
  })
);

export const Link: React.FC<ILinkProps> = props => (
  <LinkElement
    rel={props.target === '_blank' ? 'noopener noreferrer' : null}
    {...props}
  />
);
