import styled, { css } from 'styled-components';
import { Element } from '@codesandbox/components';
import { ResizeIcon } from './Icons';

export const Styled = styled(Element)<{
  width: string;
  height: string;
  theme: any;
  scale: number;
}>`
  height: 100%;

  > div {
    overflow: auto;
    margin: auto;
    background: ${props => props.theme['sideBar.background']};
    height: 100%;
    position: relative;
  }

  iframe {
    border-radius: 2px;
  }

  :not(.no-transition) > div > span {
    transition: all 300ms ease;
  }

  > div > span {
    min-width: 70px;
    min-height: 130px;
    width: ${props => props.width};
    height: ${props => props.height};

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%) scale(${props => props.scale});
    display: block;
  }
`;

export const Wrapper = styled(Element)`
  background: ${props => props.theme['sideBar.background']};

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    width: 50px;
    -moz-appearance: textfield;
  }
`;

export const ResizeWrapper = styled.span`
  position: relative;
  padding: 15px;
`;

export const CornerResize = styled(ResizeIcon)`
  position: absolute;
  bottom: 14px;
  right: 14px;
  cursor: nwse-resize;
  z-index: 2;
`;

const sizeResize = css`
  position: absolute;
  border-radius: 50px;
  opacity: 0.6;
  background-color: ${props => props.theme['sideBar.foreground']};

  z-index: 2;
  user-select: none;
  transition: opacity 200ms ease;

  :hover {
    opacity: 1;
  }
`;

export const WidthResize = styled(Element)`
  right: 0;
  top: calc(50% - 8px);
  width: 4px;
  height: 41px;
  cursor: ew-resize;
  ${sizeResize}
`;

export const HeightResize = styled(Element)`
  bottom: 0;
  left: calc(50% - 20.5px);
  width: 41px;
  height: 4px;
  cursor: ns-resize;
  ${sizeResize}
`;

export const Cover = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
