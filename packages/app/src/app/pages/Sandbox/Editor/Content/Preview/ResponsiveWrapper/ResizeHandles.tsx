import React from 'react';
import {
  Styled,
  Cover,
  CornerResize,
  ResizeWrapper,
  HeightResize,
  WidthResize,
} from './elements';

type ResizeHandlesProps = {
  on: boolean;
  width: string;
  height: string;
  scale: number;
  widthAndHeightResizer: [
    { x: number; y: number } | null,
    ({ x, y }: { x: number; y: number }) => void
  ];
  widthResizer: [{ x: number } | null, ({ x: number }) => void];
  heightResizer: [{ y: number } | null, ({ y: number }) => void];
  children: React.ReactNode;
};

export const ResizeHandles = ({
  on,
  width,
  height,
  scale,
  widthAndHeightResizer: [widthAndHeightResizer, setWidthAndHeightResizer],
  widthResizer: [widthResizer, setWidthResizer],
  heightResizer: [heightResizer, setHeightResizer],
  children,
}: ResizeHandlesProps) => (
  <Styled
    on={on}
    scale={on ? scale : 1}
    width={on ? width : '100%'}
    height={on ? height : '100%'}
    id="styled-resize-wrapper"
  >
    <div>
      <ResizeWrapper>
        <CornerResize
          onMouseDown={event => {
            setWidthAndHeightResizer({
              x: event.clientX,
              y: event.clientY,
            });
          }}
        />
        <WidthResize
          onMouseDown={event => {
            setWidthResizer({
              x: event.clientX,
            });
          }}
        />
        <HeightResize
          onMouseDown={event => {
            setHeightResizer({
              y: event.clientY,
            });
          }}
        />
        {widthAndHeightResizer || widthResizer || heightResizer ? (
          <Cover />
        ) : null}
        {children}
      </ResizeWrapper>
    </div>
  </Styled>
);
