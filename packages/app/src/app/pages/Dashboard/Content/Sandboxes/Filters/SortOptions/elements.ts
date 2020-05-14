import ArrowDown from 'react-icons/lib/md/arrow-downward';
import styled, { css } from 'styled-components';

import { OrderBy } from 'app/overmind/namespaces/dashboard/state';

export const Container = styled.div<{
  hideOrder: boolean;
}>`
  ${({ hideOrder }) => css`
    transition: 0.3s ease opacity;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    width: 175px;
    text-align: right;

    ${hideOrder &&
      css`
        opacity: 0.5;
        pointer-events: none;
      `};
  `};
`;

export const OrderName = styled.span`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;

  &:hover {
    color: white;
  }
`;

export const Arrow = styled(ArrowDown)<{ order: OrderBy['order'] }>`
  ${({ order }) => css`
    transition: 0.3s ease all;
    cursor: pointer;
    font-size: 0.875rem;
    margin-bottom: 2px;
    margin-left: 4px;
    transform: rotate(${order === 'asc' ? -180 : 0}deg);

    &:hover {
      color: white;
    }
  `};
`;
