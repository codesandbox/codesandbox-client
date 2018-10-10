import styled from 'styled-components';

export const RedIcon = styled.span`
  color: ${props => props.theme.red};
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

export const SVGIcon = styled.span`
  background-image: url(${props => props.url});
  background-size: ${props => props.width}px;
  background-position: 0;
  background-repeat: no-repeat;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
  vertical-align: top;
  flex-shrink: 0;
`;
