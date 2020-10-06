import { useEffect } from 'react';

type useDragResizeProps = {
  resolution: [number, number];
  scale: number;
  resizer: [size: { x?: number; y?: number }, setSize: (payload: any) => void];
  setResolution: (resolution: [number, number]) => void;
};

export const useDragResize = ({
  resolution,
  scale,
  resizer: [size, setSize],
  setResolution,
}: useDragResizeProps) => {
  useEffect(() => {
    if (size) {
      const [initialWidth, initialHeight] = resolution;
      const mouseMoveListener: (event: MouseEvent) => void = event => {
        document
          .getElementById('styled-resize-wrapper')
          .classList.add('no-transition');
        const width =
          'x' in size
            ? (initialWidth - (size.x - event.clientX) * 2) * (2 - scale)
            : resolution[0];
        const height =
          'y' in size
            ? (initialHeight - (size.y - event.clientY) * 2) * (2 - scale)
            : resolution[1];
        const positiveWidth = width > 72 ? width : 72;
        const positiveHeight = height > 130 ? height : 130;

        setResolution([positiveWidth, positiveHeight]);
      };
      const mouseUpListener: (event: MouseEvent) => void = () => {
        document
          .getElementById('styled-resize-wrapper')
          .classList.remove('no-transition');
        setSize(null);
        window.removeEventListener('mousemove', mouseMoveListener);
        window.removeEventListener('mouseup', mouseUpListener);
      };

      window.addEventListener('mousemove', mouseMoveListener);
      window.addEventListener('mouseup', mouseUpListener);

      return () => {
        window.removeEventListener('mousemove', mouseMoveListener);
        window.removeEventListener('mouseup', mouseUpListener);
      };
    }
    return () => {};
    // eslint-disable-next-line
  }, [size]);
};
