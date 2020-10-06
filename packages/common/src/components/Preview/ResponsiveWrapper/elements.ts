import styled from 'styled-components';
import { Element } from '@codesandbox/components';

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

  > div > span {
    min-width: 70px;
    min-height: 130px;
    width: ${props => props.width};
    height: ${props => props.height};
    transition: all 300ms ease;
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

export const CornerResize = styled(Element)`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: nwse-resize;
  z-index: 2;
  user-select: none;
`;

export const WidthResize = styled(Element)`
  position: absolute;
  right: 5px;
  top: calc(50% - 2.5px);
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: ew-resize;
  z-index: 2;
  user-select: none;
`;

export const HeightResize = styled(Element)`
  position: absolute;
  bottom: 5px;
  left: calc(50% - 2.5px);
  width: 10px;
  height: 10px;
  background-color: red;
  cursor: ns-resize;
  z-index: 2;
  user-select: none;
`;

export const Cover = styled.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
