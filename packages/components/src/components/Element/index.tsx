import styled from 'styled-components';
import css from '@styled-system/css';

export interface IElementProps {
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginBottom?: number;
  marginTop?: number; // prefer margin bottom to top
  css?: Object;
}

export const Element = styled.div<IElementProps>(props =>
  css({
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginY: props.marginY || null,
    marginBottom: props.marginBottom || null,
    marginTop: props.marginTop || null,
    ...(props.css || {}),
  })
);
