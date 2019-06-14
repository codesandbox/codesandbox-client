import styled, { css } from 'styled-components';

export const getStyles = (width = 400, top = 20) => ({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    overflowY: 'auto',
    zIndex: 30,
    transform: 'translate3d(0, 0, 0)',
  },
  content: {
    position: 'relative',
    overflow: 'hidden',
    padding: 0,
    maxWidth: width,
    top: `${top}vh`,
    bottom: 40,
    left: 0,
    right: 0,
    margin: `0 auto ${top}vh`,
    border: 'none',
    borderRadius: '4px',
  },
});

export const BaseModal = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background3};
  `}
`;

export const ModalTitle = styled.h1`
  ${({ theme }) => css`
    padding: 1rem;
    margin: 0;
    background-image: linear-gradient(-225deg, #31b0ff 0%, #47a8e5 100%);
    background-color: ${theme.secondary};
    color: white;
    font-size: 1.25rem;
    text-align: center;
  `}
`;

export const ModalBody = styled.div`
  ${({ theme }) => css`
    background-color: ${theme.background2};
    color: rgba(255, 255, 255, 0.8);
  `}
`;
