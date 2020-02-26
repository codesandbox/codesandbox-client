import css from '@styled-system/css';
import React, {
  AnchorHTMLAttributes,
  ComponentProps,
  FunctionComponent,
} from 'react';
import styled from 'styled-components';

import { Text } from '../..';

type Props = AnchorHTMLAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLSpanElement> &
  Partial<Pick<ComponentProps<typeof Text>, 'variant'>>;

const LinkElement = styled(Text).attrs(() => ({ as: 'a' }))<Props>(
  css({
    cursor: 'pointer',
    textDecoration: 'none',
    transition: 'color ease',
    transitionDuration: theme => theme.speeds[2],

    ':hover, :focus': {
      color: 'foreground',
    },
  })
);

export const Link: FunctionComponent<Props> = props => (
  <LinkElement
    rel={props.target === '_blank' ? 'noopener noreferrer' : null}
    {...props}
  />
);
