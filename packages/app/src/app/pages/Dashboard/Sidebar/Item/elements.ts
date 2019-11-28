import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import ChevronRight from 'react-icons/lib/md/chevron-right';
import { withoutProps } from '@codesandbox/common/lib/utils';

export const AnimatedChevron = styled(ChevronRight)<{ open?: boolean }>`
  ${({ open = false }) => css`
    width: 1rem;
    margin-right: 0.25rem;
    transform: rotate(${open ? 90 : 0}deg);
    transition: 0.25s ease transform;
  `}
`;

export const Container = styled(
  withoutProps(`active`, `openByDefault`)(NavLink)
)<{
  active?: boolean;
}>`
  ${({ active = false, theme }) => css`
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 2.5rem;
    padding: 0 0.5rem;
    box-sizing: border-box;
    background-color: transparent;
    color: ${theme.placeholder};
    text-decoration: none;
    cursor: pointer;
    user-select: none;
    transition: 0.3s ease all;

    &:hover {
      color: white;
    }

    ${active &&
      css`
        background-color: ${theme.secondary};
        color: white;
      `};
  `}
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  width: 2rem;
  font-size: 1.25rem;
`;

export const ItemName = styled.div`
  font-size: 0.875rem;
`;
