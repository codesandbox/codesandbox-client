import React from 'react';
import { Element } from '@codesandbox/components';
import css from '@styled-system/css';

export const Card = props => (
  <Element
    {...props}
    css={css({
      minHeight: 200,
      padding: 6,
      background: '#191919',
      border: '1px solid',
      borderColor: 'grays.600',
      borderRadius: 'medium',
      ...(props.css || {}),
    })}
  />
);
