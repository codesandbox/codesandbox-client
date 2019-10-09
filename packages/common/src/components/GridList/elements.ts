import styled, { css } from 'styled-components';
import { NextIcon } from './Next';

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

export const ArrowButton = styled.button<{ next?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  position: absolute;
  z-index: 10;
  left: 0.5rem;
  margin-top: 40px;

  ${props =>
    props.next &&
    css`
      left: auto;
      right: 0.5rem;
    `}
`;

export const Arrow = styled(NextIcon)<{ next?: boolean }>`
  transform: rotate(180deg);

  ${props =>
    props.next &&
    css`
      transform: rotate(0deg);
    `}
`;

export const CarrouselWrapper = styled.div`
  width: 50%;
  flex-grow: 1;
  flex-shrink: 0;
  margin-bottom: 2rem;
`;

export const Carrousel = styled.div<{ number: number }>`
  transition: transform 200ms ease;
  transform: ${props => `translateX(-${50 * props.number}%)`};
  display: flex;
  width: 100%;
`;
