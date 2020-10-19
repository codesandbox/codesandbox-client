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
  width: number;
  height: number;
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

const resize = (
  event: MouseEvent | React.MouseEvent,
  {
    resolution,
    initialSize,
    scale,
    resizer: [_, setSize],
    setResolution,
  }: {
    resolution: [number, number];
    initialSize: { x?: number; y?: number };
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
    const width =
      'x' in initialSize
        ? initialWidth - (initialSize.x - evt.clientX) * (2 - scale) * 2
        : resolution[0];
    const height =
      'y' in initialSize
        ? initialHeight - (initialSize.y - evt.clientY) * (2 - scale) * 2
        : resolution[1];
    const positiveWidth = width > MIN_SIZE_X ? width : MIN_SIZE_X;
    const positiveHeight = height > MIN_SIZE_Y ? height : MIN_SIZE_Y;

    // The preview can only be resized on its right and bottom side, which always align
    // with the far bottom/right of the browser
    if (
      evt.clientX < window.innerWidth - PADDING_OFFSET_X &&
      evt.clientY < window.innerHeight - PADDING_OFFSET_Y
    ) {
      newSize.x = 'x' in initialSize ? Math.round(positiveWidth) : newSize.x;
      newSize.y = 'y' in initialSize ? Math.round(positiveHeight) : newSize.y;
    }
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
  on,
  width,
  height,
  scale,
  setResolution,
  widthAndHeightResizer,
  widthResizer,
  heightResizer,
  children,
}: ResizeHandlesProps) => (
  <Styled on={on} id="styled-resize-wrapper">
    <div>
      {on ? (
        <>
          <CornerResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                scale,
                initialSize: { x: event.clientX, y: event.clientY },
                resizer: widthAndHeightResizer,
                setResolution,
              });
            }}
            style={{
              right: `calc(50% - ${(width * scale) / 2}px)`,
              bottom: `calc(50% - ${(height * scale) / 2}px)`,
            }}
          />
          <WidthResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                scale,
                initialSize: { x: event.clientX },
                resizer: widthResizer,
                setResolution,
              });
            }}
            style={{
              right: `calc(50% - 15px - ${(width * scale) / 2}px)`,
            }}
          />
          <HeightResize
            onMouseDown={event => {
              resize(event, {
                resolution: [width, height],
                scale,
                initialSize: { y: event.clientY },
                resizer: heightResizer,
                setResolution,
              });
            }}
            style={{
              bottom: `calc(50% - 15px - ${(height * scale) / 2}px)`,
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
                top: `calc(50% - ${height / 2}px)`,
                left: `calc(50% - ${width / 2}px)`,
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
