import React from 'react';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const Card = props => (
  <Element
    {...props}
    css={css({
      height: 180,
      padding: 6,
      backgroundColor: 'grays.800',
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      ...(props.css || {}),
    })}
  />
);
