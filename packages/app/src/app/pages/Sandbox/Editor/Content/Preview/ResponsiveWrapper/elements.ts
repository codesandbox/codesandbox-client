import styled, { css } from 'styled-components';
import { Element } from '@codesandbox/components';
import { ResizeIcon } from './Icons';

export const MIN_SIZE_X = 72;

export const MIN_SIZE_Y = 130;

export const PADDING_OFFSET_X = 30;

export const PADDING_OFFSET_Y = 30;

export const Styled = styled(Element)<{
  on: boolean;
  theme: any;
}>`
  height: 100%;

  > div {
    overflow: auto;
    margin: auto;
    background: ${props => props.theme['input.background']};
    height: 100%;
    position: relative;
  }

  ${props =>
    props.on
      ? css`
          iframe {
            border-radius: 2px;
            box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.24),
              0px 8px 4px rgba(0, 0, 0, 0.12);
          }
        `
      : null}

  > div > span {
    min-width: 70px;
    min-height: 130px;
    position: absolute;
    top: 0;
    left: 0;
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
  width: 100%;
  height: 100%;
  transform-origin: top;
`;

export const CornerResize = styled(ResizeIcon)`
  position: absolute;
  bottom: -0;
  right: 0;
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
  width: 4px;
  height: 41px;
  cursor: ew-resize;
  ${sizeResize}
`;

export const HeightResize = styled(Element)`
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
  user-select: none;
`;
