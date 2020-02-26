import css from '@styled-system/css';
import styled from 'styled-components';

type Props = {
  css?: object;
  margin?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number; // prefer margin bottom to top
  marginX?: number;
  marginY?: number;
  padding?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  paddingTop?: number;
  paddingX?: number;
  paddingY?: number;
};
export const Element = styled.div<Props>(props =>
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
