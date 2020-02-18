import styled, { css } from 'styled-components';

import { Row as RowBase } from './Row';

export const Row = styled(RowBase)<{ selected: boolean }>`
  ${({ selected, theme }) => css`
    font-weight: 600;
    user-select: none;

    ${selected &&
      css`
        background-color: ${theme.secondary.clearer(0.9)};
        color: ${theme.secondary};
      `};

    &:focus {
      outline: none;
    }
  `};
`;

export const Content = styled.div`
  width: 100%;
  height: calc(100% - 23px);
  padding-top: 2rem;
  box-sizing: border-box;

  @media (max-width: 768px) {
    width: calc(100% - 30px);
    margin-left: 30px;
  }
`;
