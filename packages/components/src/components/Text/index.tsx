import React from 'react';
import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const variants = {
  body: 'inherit',
  muted: 'mutedForeground',
  danger: 'errorForeground',
  active: 'button.background',
};

const overflowStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export interface ITextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  align?: string;
  weight?: string;
  fontStyle?: string;
  block?: boolean;
  maxWidth?: number | string;
  variant?: 'body' | 'muted' | 'danger' | 'active';
  dateTime?: string;
  lineHeight?: string;
}

export const Text = styled(Element).attrs(p => ({
  as: ((p as unknown) as { as: string }).as || 'span',
}))<ITextProps>(
  ({
    size,
    fontStyle,
    align,
    weight,
    block,
    variant = 'body',
    maxWidth,
    lineHeight,
    ...props
  }) =>
    css({
      fontSize: size || 'inherit', // from theme.fontSizes
      textAlign: align || 'left',
      fontWeight: weight || null, // from theme.fontWeights
      lineHeight: lineHeight || 'normal',
      fontStyle: fontStyle || null, // from theme.fontWeights
      display: block || maxWidth ? 'block' : 'inline',
      color: variants[variant],
      maxWidth,
      ...(maxWidth ? overflowStyles : {}),
    })
);
