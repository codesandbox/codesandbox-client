import styled, { css } from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';

export const Container = styled(Scrollbar)`
  flex: 1 1 auto;
`;

export const BaseScroller = styled.span`
  @media screen and (max-width: 800px) {
    padding-bottom: 40px;
  }
  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
`;

const thumb = ({ position = true } = {}) => css`
  ${position ? `width` : `height`}: 0.8rem;
  border-radius: 50px;
  border: 0.5px solid rgba(255, 255, 255, 0.8);
  background: rgba(36, 36, 36, 0.4);
  box-sizing: border-box;
  opacity: 0.4;
  cursor: pointer;
  transition: opacity 0.1s ease-in-out;

  &:hover,
  &:active {
    opacity: 1;
  }
`;

const track = ({ position = true } = {}) => css`
  ${position ? `top` : `bottom`}: 0;
  ${position ? `right` : `left`}: 0;
  display: flex;
  ${position ? `justify-content` : `align-items`}: center;
  ${position ? `width: 0.5rem !important` : `height: 0.5rem !important`};
  padding: 0.25rem;
  background-color: transparent !important;
  cursor: pointer;
`;

export const BaseTrackX = styled.span`
  ${track({ position: false })}
`;

export const BaseTrackY = styled.span`
  ${track({ position: true })}

  &:after {
    content: '';
    position: absolute;
    bottom: -1rem;
    right: 0;
    width: 1rem;
    height: 1rem;
    background-color: rgba(255, 255, 255, 0.35);
    user-select: none;
    speak: none;
  }
`;

export const BaseThumbX = styled.span`
  ${thumb({ position: false })}
`;

export const BaseThumbY = styled.span`
  ${thumb({ position: true })}
`;

export const BaseWrapper = styled.span`
  /* We want to overlay the scrollbar */
  right: 0 !important;
  bottom: 0 !important;
`;
