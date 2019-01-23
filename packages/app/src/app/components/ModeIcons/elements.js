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
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export const ViewIcon = styled.div`
  height: 1.75rem;
  transition: 0.3s ease all;
  position: relative;
  margin: 0 0.5rem;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;

  &:after {
    transition: 0.3s ease all;
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: ${props => (props.active ? 0 : 1)};
    border-radius: 2px;
    overflow: hidden;
  }
  &:hover::after {
    opacity: 0;
  }
`;

export const Hover = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 200;
`;

export const SubMode = styled.div`
  ${props =>
    props.hovering
      ? showAnimation(props.i * 0.05, props.i === 1)
      : hideAnimation(props.i * 0.05, props.i === 1)};
`;

const Icon = styled.div`
  display: inline-block;
  width: ${({ half }) =>
    half ? `calc(1.5rem - 1px)` : `3rem`}; /* 1px is for the middle border */
  border: 1px solid rgba(0, 0, 0, 0.1);
  height: 100%;
`;

export const EditorIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.templateColor || theme.secondary};
`;

export const PreviewIcon = styled(Icon)`
  background-color: ${({ theme }) => theme.primary};
`;
