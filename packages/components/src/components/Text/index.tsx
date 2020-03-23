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

export interface ITextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: number;
  align?: string;
  weight?: string;
  block?: boolean;
  maxWidth?: number | string;
  variant?: 'body' | 'muted' | 'danger';
}

export const Text = styled(Element).attrs({ as: 'span' })<ITextProps>(
  ({ size, align, weight, block, variant = 'body', maxWidth, ...props }) =>
    css({
      fontSize: size || 'inherit', // from theme.fontSizes
      textAlign: align || 'left',
      fontWeight: weight || null, // from theme.fontWeights
      color: variants[variant],
      maxWidth,
      ...(maxWidth ? overflowStyles : {}),
      display: block || maxWidth ? 'block' : 'inline',
    })
);
