import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 210px;
  width: 346px;

  background-color: ${props => props.theme.background};
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  border-radius: 2px;

  ${props =>
    props.isLast &&
    css`
      box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
    `};
`;
