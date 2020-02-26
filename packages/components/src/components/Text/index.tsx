import css from '@styled-system/css';
import { HTMLAttributes } from 'react';
import styled from 'styled-components';

import { Element } from '../..';

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

type Props = HTMLAttributes<HTMLSpanElement> & {
  align?: string;
  block?: boolean;
  maxWidth?: number | string;
  size?: number;
  variant?: keyof typeof variants;
  weight?: string;
};
export const Text = styled(Element).attrs({ as: 'span' })<Props>(
  ({ size, align, weight, block = false, variant = 'body', maxWidth }) =>
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
