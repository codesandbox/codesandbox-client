import styled, { keyframes, css } from 'styled-components';

const showAnimationKeyframes = keyframes`
  0%   { opacity: 0; transform: translateX(10px); }
  100% { opacity: 1; transform: translateX(0px); }
`;

const reverseShowAnimationKeyframes = keyframes`
  0%   { opacity: 0; transform: translateX(-10px); }
  100% { opacity: 1; transform: translateX(0px); }
`;

const showAnimation = (delay: number = 0, reverse: boolean = true) =>
  css`
    animation: ${reverse
        ? reverseShowAnimationKeyframes
        : showAnimationKeyframes}
      0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 0;
  `;

const hideAnimationKeyframes = keyframes`
  0%   { opacity: 1; transform: translateX(0px); }
  100% { opacity: 0; transform: translateX(10px); }
`;

const reverseHideAnimationKeyframes = keyframes`
  0%   { opacity: 1; transform: translateX(0px); }
  100% { opacity: 0; transform: translateX(-10px); }
`;

const hideAnimation = (delay: number = 0, reverse: boolean = true) =>
  css`
    animation: ${reverse
        ? reverseHideAnimationKeyframes
        : hideAnimationKeyframes}
      0.3s;
    animation-delay: ${delay}s;
    animation-fill-mode: forwards;
    opacity: 1;
  `;

export const Tooltips = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ViewIcon = styled.div<{ active: boolean }>`
  ${({ active }) => css`
    position: relative;
    height: 1.75rem;
    margin: 0 0.5rem;
    border-radius: 4px;
    transition: 0.3s ease all;
    overflow: hidden;
    cursor: pointer;

    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
      border-radius: 2px;
      background-color: rgba(0, 0, 0, 0.3);
      transition: 0.3s ease all;
      opacity: ${active ? 0 : 1};
      overflow: hidden;
    }
    &:hover::after {
      opacity: 0;
    }
  `}
`;

export const Hover = styled.div`
  position: relative;
  z-index: 200;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const SubMode = styled.div<{ i: number; hovering: boolean }>`
  ${({ i, hovering }) => css`
    ${hovering
      ? showAnimation(i * 0.05, i === 1)
      : hideAnimation(i * 0.05, i === 1)};
  `}
`;

const Icon = styled.div<{ half?: boolean }>`
  ${({ half = false }) => css`
    display: inline-block;
    width: ${half
      ? css`calc(1.5rem - 1px)` /* 1px is for the middle border */
      : `3rem`};
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.1);
  `}
`;

export const EditorIcon = styled(Icon)`
  ${({ theme }) => css`
    background-color: ${theme.templateColor || theme.secondary};
  `}
`;

export const PreviewIcon = styled(Icon)`
  ${({ theme }) => css`
    background-color: ${theme.primary};
  `}
`;
