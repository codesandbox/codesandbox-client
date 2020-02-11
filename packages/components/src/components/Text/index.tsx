import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const variants = {
  body: 'inherit',
  muted: 'mutedForeground',
  danger: 'errorForeground',
};

const overflowStyles = {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
};

export const Text = styled(Element).attrs({ as: 'span' })<{
  size?: number;
  align?: string;
  weight?: string;
  block?: boolean;
  variant?: 'body' | 'muted' | 'danger';
  maxWidth?: number | string;
}>(({ size, align, weight, block, variant = 'body', maxWidth, ...props }) =>
  css({
    fontSize: size || 'inherit', // from theme.fontSizes
    textAlign: align || 'left',
    fontWeight: weight || null, // from theme.fontWeights
    display: block ? 'block' : 'inline',
    color: variants[variant],
    maxWidth,
    ...(maxWidth ? overflowStyles : {}),
  })
);
