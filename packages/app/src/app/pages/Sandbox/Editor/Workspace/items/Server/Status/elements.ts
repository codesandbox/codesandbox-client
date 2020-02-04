import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;

    color: ${theme['editor.foreground'] || 'rgba(255, 255, 255, 0.8)'};
  `};
`;

export const StatusCircle = styled.div`
  ${({ color }) => css`
    border-radius: 50%;
    background-color: ${color};
    width: 8px;
    height: 8px;
    margin-left: 0.75rem; /* Very precise to keep aligned with script icons */
    margin-right: 0.75rem;
  `};
`;
