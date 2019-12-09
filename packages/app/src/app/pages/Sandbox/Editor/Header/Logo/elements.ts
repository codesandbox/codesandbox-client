import styled, { css } from 'styled-components';

export const Container = styled.a`
  ${({ theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    height: 3rem;
    padding: 0 calc(0.8rem + 1px);
    color: ${theme.light ? css`rgba(0, 0, 0, 0.8)` : theme.white};
    vertical-align: middle;
    box-sizing: border-box;
    overflow: hidden;
    text-decoration: none;
  `}
`;
