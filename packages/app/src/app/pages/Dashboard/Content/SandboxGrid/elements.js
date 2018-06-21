import styled, { css } from 'styled-components';
import Row from './Row';

export const StyledRow = styled(Row)`
  font-weight: 600;
  user-select: none;

  ${props =>
    props.selected &&
    css`
      background-color: ${props.theme.secondary.clearer(0.9)};
      color: ${props.theme.secondary};
    `};
  &:focus {
    outline: none;
  }
`;

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 23px);
  padding-top: 2rem;
  box-sizing: border-box;
`;
