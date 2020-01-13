import styled from 'styled-components';
import css from '@styled-system/css';

export const Element = styled.div<{
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginBottom?: number;
  marginTop?: number; // prefer margin bottom to top
}>(props =>
  css({
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginY: props.marginY || null,
    marginBottom: props.marginBottom || null,
    marginTop: props.marginTop || null,
  })
);
