import styled, { css } from 'styled-components';

export const CLOSE_TIMEOUT_MS = 300;

export const BaseModal = styled.div`
  ${({ theme }) => css`
    border-radius: 8px;
    background-color: ${theme.background3};
  `}
`;

export const ModalTitle = styled.h1`
  ${({ theme }) => css`
    padding: 1rem;
    margin: 0;
    background-color: ${theme.secondary};
    background-image: linear-gradient(-225deg, #31b0ff 0%, #47a8e5 100%);
    color: white;
    font-size: 1.25rem;
    text-align: center;
  `}
`;

export const ModalBody = styled.div`
  ${({ theme }) => css`
    border-radius: 8px;
    background-color: ${theme.background2};
    color: rgba(255, 255, 255, 0.8);
  `}
`;
