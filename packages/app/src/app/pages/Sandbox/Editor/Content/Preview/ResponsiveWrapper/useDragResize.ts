import { useEffect } from 'react';
import {
  MIN_SIZE_X,
  MIN_SIZE_Y,
  PADDING_OFFSET_X,
  PADDING_OFFSET_Y,
} from './elements';

type useDragResizeProps = {
  resolution: [number, number];
  scale: number;
  resizer: [{ x?: number; y?: number }, (payload: any) => void];
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
        const positiveWidth = width > MIN_SIZE_X ? width : MIN_SIZE_X;
        const positiveHeight = height > MIN_SIZE_Y ? height : MIN_SIZE_Y;

        // The preview can only be resized on its right and bottom side, which always align
        // with the far bottom/right of the browser
        if (
          event.clientX < window.innerWidth - PADDING_OFFSET_X &&
          event.clientY < window.innerHeight - PADDING_OFFSET_Y
        ) {
          setResolution([positiveWidth, positiveHeight]);
        }
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
