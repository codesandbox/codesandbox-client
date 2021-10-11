import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import { ThemeProvider, Stack } from '@codesandbox/components';

import data from './data';
import { Card } from './Card';
import { Counter } from './Counter';

const Background = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9;

  padding: 1rem 2rem;
`;

const Slider = styled.div`
  display: flex;

  box-sizing: border-box;
  height: 100%;
  overflow: auto;

  padding-top: 3.75rem;
  padding-bottom: 10rem;
  margin-right: -2rem;
  margin-left: -2rem;

  /* Sliding */
  scroll-snap-type: x mandatory;
  scrollbar-width: none;

  /* Internal margin */
  padding-left: calc(50vw + 0.5rem);
  padding-right: calc(50vw + 0.5rem);
`;

const CloseButton = styled.button`
  background: none;
  border: 0;
  width: 2rem;
  height: 2rem;

  padding: 0;
  margin-left: 2rem;

  display: flex;

  > * {
    margin: auto;
  }
`;

const OnBoarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nodeItems = useRef([]);

  const handleSliderScroll = () => {
    const activeIndex = nodeItems.current.findIndex(element => {
      const { left, width } = element.getBoundingClientRect();

      return left + width > window.innerWidth / 2;
    });

    if (activeIndex !== undefined) {
      setCurrentIndex(activeIndex);
    }
  };

  return (
    <ThemeProvider>
      <Background>
        <Stack>
          <Counter amount={data.length} />
          <CloseButton type="button">
            <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
              <path
                d="M16.5229 1.73532L15.0684 0.280772L8.52295 6.82622L1.97749 0.280762L0.522949 1.73531L7.06841 8.28076L0.522949 14.8262L1.97749 16.2808L8.52295 9.73531L15.0684 16.2808L16.5229 14.8262L9.9775 8.28076L16.5229 1.73532Z"
                fill="white"
              />
            </svg>
          </CloseButton>
        </Stack>

        <Slider onScroll={handleSliderScroll}>
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
        </Slider>
      </Background>
    </ThemeProvider>
  );
};

export { OnBoarding };
