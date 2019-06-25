import styled, { css } from 'styled-components';

import { Theme } from '../types';

export const Mode = styled.button<{ onClick: () => void; selected: boolean }>`
  ${({ onClick, selected }) => css`
    display: block;
    text-align: left;
    transition: 0.3s ease opacity;
    padding: 0.5rem 1rem;
    color: white;
    border-radius: 4px;
    width: 100%;
    font-size: 1rem;

    font-weight: 600;
    border: none;
    outline: none;
    background-color: transparent;
    cursor: ${onClick ? 'pointer' : 'inherit'};
    opacity: ${selected ? 1 : 0.6};
    margin: 0.25rem 0;

    z-index: 3;

    ${onClick &&
      css`
        &:hover {
          opacity: 1;
        }
      `};
  `}
`;

export const ModeDetails = styled.div`
  ${({ theme }: Theme) => css`
    color: ${theme.light
      ? css`rgba(0, 0, 0, 0.7)`
      : css`rgba(255, 255, 255, 0.7)`};
    font-size: 0.75rem;
    margin-top: 0.25rem;
  `}
`;

export const ModeSelect = styled.div`
  margin: 0.5rem 1rem;
  position: relative;
`;

export const ModeSelector = styled.div<{ i: number }>`
  ${({ i }) => css`
    transition: 0.3s ease transform;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 48px;

    border: 2px solid rgba(253, 36, 57, 0.6);
    background-color: rgba(253, 36, 57, 0.6);
    border-radius: 4px;
    z-index: -1;

    transform: translateY(${i * 55}px);
  `}
`;
