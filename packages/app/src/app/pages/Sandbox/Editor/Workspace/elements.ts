import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background-color: ${theme['sideBar.background'] || theme.background};
    color: ${theme['sideBar.foreground'] || 'inherit'};
    height: 100%;
    width: 100%;
    overflow-y: overlay;
    overflow-x: auto;

    * {
      box-sizing: border-box;
    }
  `};
`;
