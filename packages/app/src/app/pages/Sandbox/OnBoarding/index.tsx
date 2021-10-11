import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { throttle } from 'lodash-es';

import { ThemeProvider, Stack } from '@codesandbox/components';

import data from './data';
import { Card } from './Card';
import { Counter } from './Counter';
import { Navigation } from './Navigation';

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9;
`;

const ScrollView = styled.div`
  display: flex;

  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  padding-top: 3.75rem;
  padding-bottom: 10rem;

  /* Sliding */
  scroll-snap-type: x mandatory;
  scrollbar-width: none;
  scroll-behavior: smooth;

  /* Internal margin */
  padding-left: 50vw;
  padding-right: 50vw;
`;

const CloseButton = styled.button`
  background: none;
  border: 0;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  z-index: 999;

  padding: 0;
  margin-left: 2rem;

  display: flex;

  > * {
    margin: auto;
  }
`;

const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nodeItems = useRef<HTMLDivElement[]>([]);
  const scrollViewRef = useRef<HTMLDivElement>();

  const listLength = data.length;

  const handleSliderScroll = () => {
    const activeIndex = nodeItems.current.findIndex(element => {
      const { left, width } = element.getBoundingClientRect();
      return left + width > window.innerWidth / 2;
    });
    if (activeIndex > -1) {
      setCurrentIndex(activeIndex);
    }
  };

  const onPrev = useCallback(() => {
    if (currentIndex === 0) return;

    if (currentIndex - 1 === 0) {
      scrollViewRef.current.scrollTo(0, 0);
    } else {
      nodeItems.current[currentIndex - 1].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  const onNext = useCallback(() => {
    if (currentIndex + 1 > listLength) return;

    if (currentIndex + 1 === listLength) {
      scrollViewRef.current.scrollTo(scrollViewRef.current.scrollWidth, 0);
    } else {
      nodeItems.current[currentIndex + 1].scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    }
  }, [currentIndex, listLength]);

  useEffect(() => {
    const navigate = event => {
      if (event.key === 'ArrowRight') {
        onNext();
      } else if (event.key === 'ArrowLeft') {
        onPrev();
      }
    };

    document.addEventListener('keydown', navigate, false);
    return () => document.removeEventListener('keydown', navigate, false);
  }, [onNext, onPrev]);

  return (
    <ThemeProvider>
      <Background>
        <Stack css={{ padding: '1rem 2rem' }}>
          <Counter amount={listLength} />
          <CloseButton type="button">
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <path
                d="M16.5229 1.73532L15.0684 0.280772L8.52295 6.82622L1.97749 0.280762L0.522949 1.73531L7.06841 8.28076L0.522949 14.8262L1.97749 16.2808L8.52295 9.73531L15.0684 16.2808L16.5229 14.8262L9.9775 8.28076L16.5229 1.73532Z"
                fill="white"
              />
            </svg>
          </CloseButton>
        </Stack>

        <Navigation
          onNext={onNext}
          onPrev={onPrev}
          currentIndex={currentIndex}
          maxIndex={listLength}
        />

        <ScrollView
          ref={scrollViewRef}
          onScroll={throttle(handleSliderScroll, 300)}
        >
          {data.map((item, index) => (
            <Card
              ref={node => {
                nodeItems.current[index] = node;
              }}
              active={currentIndex === index}
              key={item.title}
              bgColor={item.bgColor}
              img={item.img}
              tagline={item.tagline}
              title={item.title}
            />
          ))}
        </ScrollView>
      </Background>
    </ThemeProvider>
  );
};

export { OnBoarding };
