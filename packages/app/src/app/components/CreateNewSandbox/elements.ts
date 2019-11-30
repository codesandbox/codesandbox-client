import styled, { css } from 'styled-components';

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100% - 1.75rem);
  box-sizing: border-box;
`;

export const Container = styled.div<{ hide?: boolean; color?: any }>`
  ${({ color, hide, theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: calc(100% - 2rem);
    height: 100%;
    border: 2px dashed ${(color || theme.secondary).clearer(0.2)};
    border-radius: 4px;
    background-color: ${(color || theme.secondary).clearer(0.9)};
    color: rgba(255, 255, 255, 1);
    font-size: 1.125rem;
    font-weight: 600;
    text-decoration: none;
    box-sizing: border-box;
    overflow: hidden;
    outline: none;
    cursor: pointer;
    user-select: none;
    transition: 0.3s ease background-color;

    ${hide &&
      css`
        opacity: 0;
      `};

    &:first-child {
      border-bottom: 0;
    }

    &:last-child {
      border-bottom: 2px dashed ${(color || theme.secondary).clearer(0.2)};
    }

    &:hover,
    &:focus {
      background-color: ${(color || theme.secondary).clearer(0.8)};
    }
  `}
`;
