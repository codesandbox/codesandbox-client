import React from 'react';

import {
  CornerResize,
  Cover,
  HeightResize,
  MIN_SIZE_X,
  MIN_SIZE_Y,
  PADDING_OFFSET_X,
  PADDING_OFFSET_Y,
  ResizeWrapper,
  Styled,
  WidthResize,
} from './elements';

type ResizeHandlesProps = {
  on: boolean;
  showResizeHandles: boolean;
  width: number;
  height: number;
  wrapper: HTMLDivElement;
  scale: number;
  widthAndHeightResizer: [
    { x: number; y: number } | null,
    ({ x, y }: { x: number; y: number }) => void
  ];
  widthResizer: [{ x: number } | null, ({ x: number }) => void];
  heightResizer: [{ y: number } | null, ({ y: number }) => void];
  setResolution: (resolution: [number, number]) => void;
  children: React.ReactNode;
};

const HANDLE_OFFSET = 15;

const resize = (
  event: MouseEvent | React.MouseEvent,
  {
    resolution,
    initialMousePosition,
    wrapper,
    scale,
    offset,
    resizer: [_, setSize],
    setResolution,
  }: {
    resolution: [number, number];
    // Holds the actual mouse position and its offset on the 4px handle to determine
    // where it should stop resizing. [position, handleOffset]
    initialMousePosition: { x?: number; y?: number };
    // We need the wrapper, because we already introduce elements at the bottom of it,
    // and we might introduce stuff on the right side. Meaning our constraint logic
    // needs to know where the edges are
    wrapper: HTMLDivElement;
    // We need to know the offset of the handle, which is different from the explicit width
    // and height handles and the both direction resizer
    offset: number;
    scale: number;
    resizer: [{ x?: number; y?: number }, (payload: any) => void];
    setResolution: (resolution: [number, number]) => void;
  }
) => {
  const [initialWidth, initialHeight] = resolution;
  const newSize = {
    x: resolution[0],
    y: resolution[1],
  };

  function calculate(evt: MouseEvent | React.MouseEvent) {
    const {
      right: wrapperRight,
      bottom: wrapperBottom,
    } = wrapper.getBoundingClientRect();
    const maxClientX = Math.min(
      evt.clientX,
      wrapperRight - PADDING_OFFSET_X + offset
    );
    const maxClientY = Math.min(
      evt.clientY,
      wrapperBottom - PADDING_OFFSET_Y + offset
    );
    const width =
      'x' in initialMousePosition
        ? initialWidth - (initialMousePosition.x - maxClientX) * (2 - scale) * 2
        : resolution[0];
    const height =
      'y' in initialMousePosition
        ? initialHeight - (initialMousePosition.y - maxClientY) * (2 - scale)
        : resolution[1];
    const positiveWidth = width > MIN_SIZE_X ? width : MIN_SIZE_X;
    const positiveHeight = height > MIN_SIZE_Y ? height : MIN_SIZE_Y;

    // The preview can only be resized on its right and bottom side, which always align
    // with the far bottom/right of the browser
    newSize.x = Math.round(
      'x' in initialMousePosition ? positiveWidth : newSize.x
    );
    newSize.y = Math.round(
      'y' in initialMousePosition ? positiveHeight : newSize.y
    );
  }

  const mouseMoveListener: (event: MouseEvent) => void = evt => {
    calculate(evt);
    setSize({ ...newSize });
  };
  const mouseUpListener: (event: MouseEvent) => void = evt => {
    window.removeEventListener('mousemove', mouseMoveListener);
    window.removeEventListener('mouseup', mouseUpListener);
    calculate(evt);
    setResolution([newSize.x, newSize.y]);
    setSize(null);
  };

  window.addEventListener('mousemove', mouseMoveListener);
  window.addEventListener('mouseup', mouseUpListener);

  calculate(event);
  setSize({ ...newSize });
};

export const ResizeHandles = ({
  showResizeHandles,
  on,
  width,
  height,
  wrapper,
  scale,
  setResolution,
  widthAndHeightResizer,
  widthResizer,
  heightResizer,
  children,
}: ResizeHandlesProps) => (
  <Styled on={on} id="styled-resize-wrapper">
    <div>
      {showResizeHandles ? (
        <>
          <CornerResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                scale,
                wrapper,
                offset: 0,
                initialMousePosition: { x: event.clientX, y: event.clientY },
                resizer: widthAndHeightResizer,
                setResolution,
              });
            }}
            style={{
              right: `calc(50% - ${(width * scale) / 2}px)`,
              top: `calc(${height * scale + HANDLE_OFFSET}px)`,
            }}
          />
          <WidthResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                scale,
                wrapper,
                offset: HANDLE_OFFSET,
                initialMousePosition: { x: event.clientX },
                resizer: widthResizer,
                setResolution,
              });
            }}
            style={{
              right: `calc(50% - ${HANDLE_OFFSET}px - ${
                (width * scale) / 2
              }px)`,
              top: `calc(${(height / 2) * scale - 8}px)`,
            }}
          />
          <HeightResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                wrapper,
                scale,
                offset: HANDLE_OFFSET,
                initialMousePosition: { y: event.clientY },
                resizer: heightResizer,
                setResolution,
              });
            }}
            style={{
              top: `calc(${height * scale + HANDLE_OFFSET * 3}px)`,
            }}
          />
        </>
      ) : null}
      <ResizeWrapper
        style={
          on
            ? {
                width,
                height,
                left: `calc(50% - ${width / 2}px)`,
                top: HANDLE_OFFSET * 2,
                transform: `scale(${scale})`,
              }
            : null
        }
      >
        {widthAndHeightResizer[0] || widthResizer[0] || heightResizer[0] ? (
          <Cover />
        ) : null}
        {children}
      </ResizeWrapper>
    </div>
  </Styled>
);
