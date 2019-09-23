import React, { useState, useRef, useEffect } from 'react';
import SimpleBar from 'simplebar-react';
import {
  ScrollContent as Content,
  ScrollWrapper,
  ScrollBarCSS,
} from './elements';

export const ScrollableContent = ({ children }) => {
  const [scrolled, setScrolled] = useState(false);
  const scrollableElRef = useRef(null);

  useEffect(() => {
    scrollableElRef.current.addEventListener('scroll', e =>
      setScrolled(e.currentTarget.scrollTop > 0)
    );
  }, [scrollableElRef]);

  return (
    <>
      <ScrollBarCSS />
      <ScrollWrapper scrolled={scrolled}>
        <Content>
          <SimpleBar scrollableNodeProps={{ ref: scrollableElRef }}>
            {children}
          </SimpleBar>
        </Content>
      </ScrollWrapper>
    </>
  );
};
