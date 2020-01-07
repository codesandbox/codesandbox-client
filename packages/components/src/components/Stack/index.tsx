import styled from 'styled-components';
import css from '@styled-system/css';

export const Stack = styled.div<{
  gap?: number; // theme.space token
  direction?: 'horizontal' | 'vertical';
  justify?: string;
  align?: string;
}>(({ gap = 0, direction = 'horizontal', justify, align }) =>
  css({
    display: 'flex',
    flexDirection: direction === 'horizontal' ? 'row' : 'column',
    justifyContent: justify,
    alignItems: align,

    '> *:not(:last-child)': {
      [direction === 'horizontal' ? 'marginRight' : 'marginBottom']: gap,
    },
  })
);
