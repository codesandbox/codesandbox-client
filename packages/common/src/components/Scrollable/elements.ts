import styled, { css } from 'styled-components';
import { Scrollbar } from 'react-scrollbars-custom';

export const Container = styled(Scrollbar)`
  flex: 1 1 auto;
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
  width: ${position ? `1rem` : `calc(100% - 1rem)`};
  height: ${position ? `calc(100vh - 1rem)` : `1rem`};
  padding: 0.25rem;
  background-color: rgba(255, 255, 255, 0.35);
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
