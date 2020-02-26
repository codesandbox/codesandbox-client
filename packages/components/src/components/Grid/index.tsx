import css from '@styled-system/css';
import styled from 'styled-components';

import { Element } from '../..';

const fontSize = 1; // rem = 16px
const lineHeight = fontSize * 1.5;

export const Grid = styled(Element)<{ columnGap?: number; rowGap?: number }>(
  ({ columnGap, rowGap }) =>
    css({
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)', // always 12 columns
      gridColumnGap:
        columnGap === undefined ? `${lineHeight * 2}rem` : columnGap,
      gridRowGap: rowGap === undefined ? `${lineHeight}rem` : rowGap,
    })
);

// Valid combinations are:
// end + start | span | span + start | start
// TODO: end + span is also possible but not implemented here
type ColumnProp = number | number[];
type ColumnProps =
  | { end: ColumnProp; span?: undefined; start: ColumnProp }
  | { end?: undefined; span: ColumnProp; start?: undefined }
  | { end?: undefined; span: ColumnProp; start: ColumnProp }
  | { end?: undefined; span?: undefined; start: ColumnProp };
export const Column = styled(Element)<ColumnProps>(({ end, span, start }) => {
  const styles: {
    gridColumnStart?: number | Array<number | string>;
    gridColumnEnd?: number | string | number[] | string[];
  } = {};

  if (Array.isArray(start)) {
    styles.gridColumnStart = start.map(s => s);
  } else if (start) {
    styles.gridColumnStart = start;
  }

  if (Array.isArray(end)) {
    styles.gridColumnEnd = end.map(s => s + 1);
  } else if (end) {
    styles.gridColumnEnd = end + 1;
  }

  if (Array.isArray(span)) {
    styles.gridColumnEnd = span.map(s => `span ${s}`);
  } else if (span) {
    styles.gridColumnEnd = `span ${span}`;
  }

  return css(styles);
});

export const Row = styled(Grid).attrs({ span: 12 })(
  css({
    gridColumnEnd: 'span 12',
  })
);
