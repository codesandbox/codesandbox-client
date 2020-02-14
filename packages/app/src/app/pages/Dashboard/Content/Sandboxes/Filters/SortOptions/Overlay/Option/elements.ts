import styled, { css } from 'styled-components';

export const Container = styled.a<{
  selected: boolean;
}>`
  ${({ selected, theme }) => css`
    transition: 0.3s ease color;
    display: flex;
    vertical-align: middle;
    align-items: center;
    margin-bottom: 0.5rem;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    text-decoration: none;
    cursor: pointer;
    font-weight: 600;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      color: white;
    }

    ${selected &&
      css`
        color: white;
      `};
  `};
`;

export const IconContainer = styled.div`
  width: 1rem;
  margin-right: 0.5rem;
`;
