import styled, { css } from 'styled-components';

export const File = styled.div<{ created: boolean }>`
  ${({ created }) => css`
    position: relative;
    transition: 0.3s ease background-color;
    padding: 0.75rem 1rem;

    ${created &&
      css`
        cursor: pointer;
      `};

    ${!created &&
      css`
        opacity: 0.9;
      `};
  `};
`;

export const CreateButton = styled.button`
  ${({ theme }) => css`
    padding: 0.25rem 0.4rem;
    background-color: ${theme.secondary};
    border: none;
    font-size: 0.75rem;
    color: white;
    border-radius: 2px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 0.75rem;
  `};
`;

export const FileTitle = styled.div`
  ${({ theme }) => css`
    font-weight: 600;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    vertical-align: middle;
  `};
`;

export const FileDescription = styled.p`
  ${({ theme }) => css`
    font-size: 0.875rem;
    margin-top: 0.25rem;
    font-weight: 400;
    color: ${theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};
    margin-bottom: 0;
  `};
`;
