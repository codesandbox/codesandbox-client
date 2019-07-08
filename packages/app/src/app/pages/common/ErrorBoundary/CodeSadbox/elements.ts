import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100vh;
    background-color: ${theme.background2};
    color: ${theme.white};
  `}
`;

export const Title = styled.h1`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
  `}
`;

export const Subtitle = styled.h2`
  ${({ theme }) => css`
    display: flex;
    justify-content: center;
  `}
`;

export const Actions = styled.section`
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  margin-top: 1rem;
`;

export const IssueLink = styled.a.attrs({
  target: `_blank`,
  rel: `noopener noreferrer`,
})`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    padding: 0.5em 0.7em;
    border: 2px solid ${theme.secondary};
    border-radius: 4px;
    box-sizing: border-box;
    color: ${theme.gray};
    text-align: center;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease 0s;
    outline: none;

    &:hover {
      background-color: rgb(102, 185, 244);
      color: ${theme.lightText};
    }

    svg {
      font-size: 1rem;
      padding-right: 0.5rem;
    }
  `}
`;
