import styled from 'styled-components';
import css from '@styled-system/css';

export const Element = styled.div<{
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginBottom?: number;
}>(props =>
  css({
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginY: props.marginX || null,
    marginBottom: props.marginBottom || null,
  })
);
