import css from '@styled-system/css';
import styled from 'styled-components';

import { Element } from '../Element';

const variants = {
  body: 'inherit',
  danger: 'errorForeground',
  muted: 'mutedForeground',
};

export const Text = styled(Element).attrs({ as: 'span' })<{
  align?: string;
  size?: number;
  variant?: 'body' | 'muted' | 'danger';
  weight?: string;
}>(({ size, align, weight, variant = 'body' }) =>
  css({
    fontSize: size || 'inherit', // from theme.fontSizes
    fontWeight: weight || null, // from theme.fontWeights
    color: variants[variant],
    textAlign: align || 'left',
  })
);
