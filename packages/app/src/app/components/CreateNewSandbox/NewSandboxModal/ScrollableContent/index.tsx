import React, { useState, useRef, useEffect } from 'react';
import Scrollbar from 'smooth-scrollbar';
import {
  ScrollContent as Content,
  ScrollWrapper,
  ScrollBarCSS,
} from './elements';

type ScrollableContentProps = {
  children: React.ReactNode;
  onBottomReached?: () => void;
  keepCalling?: boolean;
};

export const ScrollableContent = ({
  children,
  onBottomReached,
  keepCalling,
}: ScrollableContentProps) => {
  const [scrolled, setScrolled] = useState(false);
  const scrollableElRef = useRef(null);
  const [scrollbar, setScrollbar] = useState(null);
  const [lastCalled, setLastCalled] = useState(null);
  useEffect(() => {
    setScrollbar(
      Scrollbar.init(scrollableElRef.current, {
        alwaysShowTracks: true,
        continuousScrolling: true,
      })
    );
  }, []);

  useEffect(() => {
    if (scrollbar && keepCalling) {
      scrollbar.addListener(status => {
        setScrolled(status.offset.y > 10);
        if (status.offset.y === status.limit.y) {
          if (lastCalled !== status.offset.y) {
            onBottomReached();
            setLastCalled(status.offset.y);
          }
        }
      });
    }
  }, [keepCalling, lastCalled, onBottomReached, scrollableElRef, scrollbar]);

  return (
    <>
      <ScrollBarCSS />
      <ScrollWrapper scrolled={scrolled}>
        <Content>
          <div
            data-scrollbar
            style={{ height: '100%', overflow: 'hidden' }}
            ref={scrollableElRef}
          >
            {children}
          </div>
        </Content>
      </ScrollWrapper>
    </>
  );
};
