import styled, { css } from 'styled-components';

export const Title = styled.h3`
  ${({ theme }) => css`
    width: 60%;
    color: ${theme.white};
    font-family: 'Poppins', 'Roboto', sans-serif;
    font-size: 24px;
    font-weight: 600;
    line-height: 36px;
  `}
`;

export const Empty = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  text-align: center;
`;
