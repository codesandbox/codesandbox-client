import { Button as ButtonBase } from '@codesandbox/common/lib/components/Button';
import ChevronRightBase from 'react-icons/lib/md/chevron-right';
import styled, { css } from 'styled-components';

import { Container as ContainerBase } from '../elements';

export const Block = styled.div<{ right?: boolean }>`
  ${({ right, theme }) => css`
    background-color: ${theme.background2};
    color: rgba(255, 255, 255, 0.9);
    padding: 1rem 1.5rem;

    font-size: 0.875rem;
    font-weight: 600;

    ${right &&
      css`
        text-align: right;
      `};
  `};
`;

export const Button = styled(ButtonBase)`
  display: inline-flex;
  align-items: center;
`;

export const CancelButton = styled.button`
  ${({ theme }) => css`
    transition: 0.3s ease color;
    font-size: 0.875rem;
    margin-right: 1.5rem;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.8);
    outline: 0;
    border: 0;
    background-color: transparent;
    cursor: pointer;

    &:hover {
      color: ${theme.secondary};
    }
  `};
`;

export const ChevronRight = styled(ChevronRightBase)`
  margin-right: -0.25rem;
  margin-left: 0.25rem;
`;

export const Container = styled(ContainerBase)`
  max-height: 400px;
  overflow: auto;
`;
