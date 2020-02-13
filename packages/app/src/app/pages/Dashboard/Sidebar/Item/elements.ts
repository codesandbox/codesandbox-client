import ChevronRight from 'react-icons/lib/md/chevron-right';
import { Animate as AnimateBase } from 'react-show';
import styled, { css } from 'styled-components';

export const Animate = styled(AnimateBase)`
  height: auto;
  overflow: hidden;
`;

export const AnimatedChevron = styled(ChevronRight)<{ open: boolean }>`
  ${({ open }) => css`
    transition: 0.25s ease transform;
    transform: rotate(${open ? 90 : 0}deg);
    margin-right: 0.25rem;
    width: 1rem;
  `};
`;

export const ChevronPlaceholder = styled.div`
  width: 16px;
  height: 16px;
  margin-right: 0.25rem;
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
