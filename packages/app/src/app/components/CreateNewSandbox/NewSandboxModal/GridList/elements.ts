import styled, { css } from 'styled-components';
import { NextIcon } from '../Icons/Next';

export const Container = styled.div`
  display: flex;
  margin: 0 1.5rem;
  overflow: hidden;

  > div {
    &:first-child button {
      padding-left: 0px;
    }
  }
`;

export const Arrow = styled(NextIcon)<{ next?: boolean }>`
  position: absolute;
  cursor: pointer;
  z-index: 10;
  left: 0.5rem;
  transform: rotate(180deg);
  margin-top: 40px;

  ${props =>
    props.next &&
    css`
      left: auto;
      right: 0.5rem;
      transform: rotate(0deg);
    `}
`;

export const CarrouselWrapper = styled.div`
  width: 50%;
  flex-grow: 1;
  flex-shrink: 0;
`;

export const Carrousel = styled.div<{ number: number }>`
  transition: transform 200ms ease;
  transform: ${props => `translateX(-${50 * props.number}%)`};
  display: flex;
  width: 100%;
`;
