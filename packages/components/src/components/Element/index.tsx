import css from '@styled-system/css';
import styled from 'styled-components';

export const Element = styled.div<{
  css?: Object;
  margin?: number;
  marginBottom?: number;
  marginTop?: number; // prefer margin bottom to top
  marginX?: number;
  marginY?: number;
}>(props =>
  css({
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginY: props.marginY || null,
    marginBottom: props.marginBottom || null,
    marginTop: props.marginTop || null,
    ...(props.css || {}),
  })
);
