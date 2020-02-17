import styled from 'styled-components';
import css from '@styled-system/css';

export interface IElementProps {
  margin?: number;
  marginX?: number;
  marginY?: number;
  marginBottom?: number;
  marginTop?: number; // prefer margin bottom to top
  marginLeft?: number;
  marginRight?: number;
  padding?: number;
  paddingX?: number;
  paddingY?: number;
  paddingBottom?: number;
  paddingTop?: number;
  paddingLeft?: number;
  paddingRight?: number;
  css?: Object;
}

export const Element = styled.div<IElementProps>(props =>
  css({
    boxSizing: 'border-box',
    margin: props.margin || null,
    marginX: props.marginX || null,
    marginY: props.marginY || null,
    marginBottom: props.marginBottom || null,
    marginTop: props.marginTop || null,
    marginLeft: props.marginLeft || null,
    marginRight: props.marginRight || null,
    padding: props.padding || null,
    paddingX: props.paddingX || null,
    paddingY: props.paddingY || null,
    paddingBottom: props.paddingBottom || null,
    paddingTop: props.paddingTop || null,
    paddingLeft: props.paddingLeft || null,
    paddingRight: props.paddingRight || null,
    ...(props.css || {}),
  })
);
