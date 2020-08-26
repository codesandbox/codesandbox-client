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

export const Stack = styled(Element)<StackProps>(
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
      styles['> *:not(:last-child)'] = direction.map(d => createGap(d, gap));
    } else {
      styles.flexDirection = direction === 'vertical' ? 'column' : 'row';
      styles['> *:not(:last-child)'] = createGap(direction, gap);
    }

    return css(styles);
  }
);

const createGap = (direction, gap) => {
  if (direction === 'vertical') {
    return {
      marginBottom: gap,
      marginRight: 0,
    };
  }

  return {
    marginBottom: 0,
    marginRight: gap,
  };
};
