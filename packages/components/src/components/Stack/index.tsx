import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

export const Stack = styled(Element)<{
  gap?: number; // theme.space token
  direction?: 'horizontal' | 'vertical';
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  inline?: boolean;
}>(({ gap = 0, direction = 'horizontal', justify, align, inline }) =>
  css({
    display: inline ? 'inline-flex' : 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    justifyContent: justify,
    alignItems: align,

    '> *:not(:last-child)': {
      [direction === 'horizontal' ? 'marginRight' : 'marginBottom']: gap,
    },
  })
);
