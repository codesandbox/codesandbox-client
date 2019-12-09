import styled, { css } from 'styled-components';

export const Button = styled.button<{ active: boolean }>`
  ${({ active }) => css`
    display: flex;
    justify-content: space-between;
    transition: 0.3s ease all;
    width: 100%;
    height: 100%;
    outline: none;
    border: none;
    background-color: ${active ? '#eeeeee' : 'white'};
    padding: 1rem;
    color: rgba(0, 0, 0, 0.9);
    box-sizing: border-box;
    border-bottom: 1px solid #dddddd;
    text-align: left;
    ${active &&
      css`
        font-weight: 600;
      `};
    cursor: ${active ? 'default' : 'pointer'};

    &:hover {
      background-color: #eeeeee;
    }
  `};
`;

export const Date = styled.div`
  color: rgba(0, 0, 0, 0.6);
`;
