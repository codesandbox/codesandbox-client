import styled from 'styled-components';
import css from '@styled-system/css';
import { Element } from '../Element';

const fontSize = 1; // rem = 16px
const lineHeight = fontSize * 1.5;

export const Grid = styled(Element)<{ columnGap?: number; rowGap?: number }>(
  ({ columnGap, rowGap }) =>
    css({
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)', // always 12 columns
      gridColumnGap:
        typeof columnGap !== 'undefined' ? columnGap : lineHeight * 2 + 'rem',
      gridRowGap: typeof rowGap !== 'undefined' ? rowGap : lineHeight + 'rem',
    })
);

// todo: end and span cant be together
// valid combinations are
// start | start + end | start + span | span
// span + end is also possible but not implemented here
export const Column = styled(Element)<{
  start?: number | Array<number>;
  end?: number | Array<number>;
  span?: number | Array<number>;
}>(({ start, end, span }) => {
  const styles: {
    gridColumnStart?: number | Array<number | string>;
    gridColumnEnd?: number | string | Array<number> | Array<string>;
    display?: string | Array<string>;
  } = {};

  if (Array.isArray(start)) styles.gridColumnStart = start.map(s => s);
  else if (start) styles.gridColumnStart = start;

  if (Array.isArray(end)) styles.gridColumnEnd = end.map(s => s + 1);
  else if (end) styles.gridColumnEnd = end + 1;

  if (Array.isArray(span)) styles.gridColumnEnd = span.map(s => 'span  ' + s);
  else if (span) styles.gridColumnEnd = 'span ' + span;

  // not sure if span=0 is a good idea, we'll find out
  if (Array.isArray(span)) {
    styles.display = span.map(s => (s === 0 ? 'none' : 'inherit'));
  } else if (span === 0) styles.display = 'none';

  return css(styles);
});

export const Row = styled(Grid).attrs({ span: 12 })(
  css({
    gridColumnEnd: 'span 12',
  })
);
