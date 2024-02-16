import styled, { css } from 'styled-components';

export const Details = styled.div`
  ${({ theme }) => css`
    display: inline-flex;
    flex-direction: column;
    flex: 3;
    gap: 16px;
    justify-content: space-between;
    padding: 32px;
    background-color: ${theme.light
      ? css`rgba(255, 255, 255, 0.3)`
      : css`rgba(0, 0, 0, 0.3)`};
  `}
`;

export const Heading = styled.div`
  ${({ theme }) => css`
    margin-bottom: 0.25rem;
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.5)`
      : css`rgba(255, 255, 255, 0.5)`};
    font-size: 0.75rem;
  `}
`;

export const Info = styled.div`
  font-weight: 400;
  font-size: 0.75rem;
`;

export const Action = styled.div<{ red: boolean }>`
  ${({ red, theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 1.5rem;
    height: 1.5rem;
    border: 1px solid ${red ? css`rgba(255, 0, 0, 0.4)` : theme.secondary};
    border-radius: 4px;
    background-color: ${red ? `transparent` : theme.secondary};
    color: ${red ? css`rgba(255, 0, 0, 0.6)` : `white`};
    opacity: 0.8;
    transition: 0.3s ease all;
    cursor: pointer;

    &:hover {
      background-color: ${red ? css`rgba(255, 0, 0, 0.6)` : theme.secondary};
      color: white;
      opacity: 1;
    }
  `}
`;
