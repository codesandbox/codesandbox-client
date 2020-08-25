import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

type StackProps = {
  direction?: 'horizontal' | 'vertical' | ('horizontal' | 'vertical')[];
  justify?: React.CSSProperties['justifyContent'];
  align?: React.CSSProperties['alignItems'];
  inline?: boolean;
  gap?: number;
};

export const Stack = styled(Element).attrs(p => ({
  as: ((p as unknown) as { as: string }).as || 'div',
}))<StackProps>(
  ({ direction = 'horizontal', justify, align, inline = false, gap }) => {
    const styles = {
      display: inline ? 'inline-flex' : 'flex',
      justifyContent: justify,
      alignItems: align,
      flexDirection: 'row' as 'row' | 'column' | ('row' | 'column')[],
    };

    if (Array.isArray(direction)) {
      styles.flexDirection = direction.map(d =>
        d === 'vertical' ? 'column' : 'row'
      );
      styles['> * + *'] = direction.map(d => createGap(d, gap));
    } else {
      styles.flexDirection = direction === 'vertical' ? 'column' : 'row';
      styles['> * + *'] = createGap(direction, gap);
    }

    return css(styles);
  }
);

const createGap = (direction, gap) => {
  if (direction === 'vertical') {
    return {
      marginTop: gap,
      marginLeft: 0,
    };
  }

  return {
    marginTop: 0,
    marginLeft: gap,
  };
};
