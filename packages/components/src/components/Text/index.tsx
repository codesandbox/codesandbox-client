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

const fontFamilies = {
  inter: 'Inter, sans-serif',
  everett: 'Everett, sans-serif',
};

export interface ITextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  align?: string;
  weight?: string;
  fontStyle?: string;
  block?: boolean;
  truncate?: boolean;
  maxWidth?: number | string;
  variant?: 'body' | 'muted' | 'danger' | 'active';
  dateTime?: string;
  lineHeight?: string;
  color?: string;
  fontFamily?: 'inter' | 'everett';
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
    truncate,
    variant = 'body',
    maxWidth,
    lineHeight,
    color,
    fontFamily,
    ...props
  }) =>
    css({
      fontSize: size || 'inherit', // from theme.fontSizes
      textAlign: align || 'left',
      fontWeight: weight || null, // from theme.fontWeights
      lineHeight: lineHeight || 'normal',
      fontStyle: fontStyle || null, // from theme.fontWeights
      display: block || maxWidth ? 'block' : 'inline',
      color: color || variants[variant],
      maxWidth,
      fontFamily: fontFamilies[fontFamily],
      ...(maxWidth ? overflowStyles : {}),
      ...(truncate ? overflowStyles : {}),
    })
);
