import React from 'react';
import {
  Container,
  BaseTrackX,
  BaseTrackY,
  BaseThumbX,
  BaseThumbY,
  BaseWrapper,
  BaseScroller,
} from './elements';

interface IScrollableProps {
  TrackX?: React.ElementType;
  TrackY?: React.ElementType;
  ThumbX?: React.ElementType;
  ThumbY?: React.ElementType;
  Wrapper?: React.ElementType;
  Scroller?: React.ElementType;
}

export const Scrollable: React.FC<IScrollableProps> = ({
  TrackX = BaseTrackX,
  TrackY = BaseTrackY,
  ThumbX = BaseThumbX,
  ThumbY = BaseThumbY,
  Wrapper = BaseWrapper,
  Scroller = BaseScroller,
  ...props
}) => (
  <Container
    {...props}
    trackXProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <TrackX ref={elementRef} {...itemProps} />
      ),
    }}
    trackYProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <TrackY ref={elementRef} {...itemProps} />
      ),
    }}
    thumbXProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <ThumbX ref={elementRef} {...itemProps} />
      ),
    }}
    thumbYProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <ThumbY ref={elementRef} {...itemProps} />
      ),
    }}
    wrapperProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <Wrapper ref={elementRef} {...itemProps} />
      ),
    }}
    scrollerProps={{
      renderer: ({ elementRef, ...itemProps }) => (
        <Scroller ref={elementRef} {...itemProps} />
      ),
    }}
  />
);
