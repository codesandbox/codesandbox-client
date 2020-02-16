import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    overflow: hidden;
    box-sizing: border-box;
    right: 0;
    text-align: left;
    line-height: 1.6;
    width: 200px;
    padding: 1rem;
    z-index: 10;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;

    border-radius: 2px;
    box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);

    background-color: ${theme.background};
  `};
`;
