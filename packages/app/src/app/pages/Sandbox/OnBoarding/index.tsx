import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import track from '@codesandbox/common/lib/utils/analytics';
import { ThemeProvider, Stack } from '@codesandbox/components';
import { useEffects } from 'app/overmind';

import data from './data';
import { Card } from './Card';
import { Counter } from './Counter';
import { Navigation } from './Navigation';
import { AUTO_RUN_TIMER } from './config';

const MARGIN = 16;

const OnBoarding = () => {
  const [visibility, setVisibility] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(0);
  const { browser } = useEffects();

  useEffect(() => {
    const shouldOnboard = browser.storage.get('should-onboard-user');

    if (shouldOnboard) {
      setVisibility(true);
    }
  }, []);

  const completeOnboarding = () => {
    setVisibility(false);
    browser.storage.set('should-onboard-user', false);
    track('OnBoarding - complete', { slideIndex: currentIndex });
  };

  const nodeItems = useRef<HTMLDivElement[]>([]);
  const scrollViewRef = useRef<HTMLDivElement>();

  const listLength = data.length;

  const handlePrev = useCallback(() => {
    if (currentIndex === 0) return;

    const element = nodeItems.current?.[currentIndex - 1];

    if (!element) return;

    setSliderPosition(prev => prev + (element.offsetWidth ?? 0) + MARGIN);
    setCurrentIndex(prev => prev - 1);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= listLength) return;

    const element = nodeItems.current?.[currentIndex + 1];

    if (!element) return;

    setSliderPosition(prev => prev - (element.offsetWidth ?? 0) - MARGIN);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, listLength]);

  useEffect(
    function keyboardNavigation() {
      const navigate = event => {
        if (event.key === 'ArrowRight') {
          handleNext();
        } else if (event.key === 'ArrowLeft') {
          handlePrev();
        }
      };

      document.addEventListener('keydown', navigate, false);
      return () => document.removeEventListener('keydown', navigate, false);
    },
    [handleNext, handlePrev]
  );

  useEffect(
    function autoRun() {
      const timer = setTimeout(() => {
        handleNext();

        // Auto-close after animation
        if (currentIndex + 1 === listLength) {
          completeOnboarding();
        }
      }, AUTO_RUN_TIMER);

      return () => {
        clearTimeout(timer);
      };
    },
    [currentIndex, listLength, handleNext]
  );

  const centerElement = useCallback(() => {
    if (!nodeItems.current) return;

    const elementWidth = nodeItems.current[0]?.offsetWidth ?? 0;

    setCurrentIndex(0);
    setSliderPosition(-elementWidth / 2);
  }, []);

  useEffect(
    function onResizeCenter() {
      window.addEventListener('resize', centerElement);

      return () => {
        window.removeEventListener('resize', centerElement);
      };
    },
    [centerElement]
  );

  useLayoutEffect(
    function init() {
      if (visibility) {
        centerElement();
      }
    },
    [visibility]
  );

  return (
    <ThemeProvider>
      <AnimatePresence>
        {visibility && (
          <Background exit={{ opacity: 0 }}>
            <Stack css={{ padding: '1rem 2rem' }}>
              <Counter amount={listLength} currentIndex={currentIndex} />
              <CloseButton
                type="button"
                onClick={() => {
                  completeOnboarding();
                  track('OnBoarding - click close');
                }}
              >
                <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
                  <path
                    d="M16.5229 1.73532L15.0684 0.280772L8.52295 6.82622L1.97749 0.280762L0.522949 1.73531L7.06841 8.28076L0.522949 14.8262L1.97749 16.2808L8.52295 9.73531L15.0684 16.2808L16.5229 14.8262L9.9775 8.28076L16.5229 1.73532Z"
                    fill="white"
                  />
                </svg>
              </CloseButton>
            </Stack>

            <Navigation
              onNext={handleNext}
              onPrev={handlePrev}
              currentIndex={currentIndex}
              maxIndex={listLength}
            />

            <ScrollView
              transition={{ delay: 0.3 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              ref={scrollViewRef}
            >
              <StackHolder
                style={{ transform: `translate3D(${sliderPosition}px, 0, 0)` }}
              >
                {data.map((item, index) => {
                  const onClick = () => {
                    if (currentIndex === index || currentIndex < index) {
                      handleNext();
                    }
                    if (currentIndex > index) handlePrev();
                  };

                  return (
                    <Card
                      ref={node => {
                        nodeItems.current[index] = node;
                      }}
                      active={currentIndex === index}
                      align={item.align}
                      cover={item.cover}
                      bgColor={item.bgColor}
                      cta={item.cta}
                      img={item.img}
                      key={item.title}
                      onClick={onClick}
                      onComplete={completeOnboarding}
                      tagline={item.tagline}
                      title={item.title}
                    />
                  );
                })}
              </StackHolder>
            </ScrollView>
          </Background>
        )}
      </AnimatePresence>
    </ThemeProvider>
  );
};

const Background = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: #000;
  z-index: 9;
`;

const ScrollView = styled(motion.div)`
  display: flex;
  align-items: center;

  box-sizing: border-box;
  height: 100%;
  overflow: hidden;

  padding-top: 3.75rem;
  padding-bottom: 10rem;
  padding-left: 50vw;
`;

const StackHolder = styled.div`
  display: flex;
  transition: all 0.3s ease;
  height: 100%;

  @media screen and (min-width: 420px) {
    height: auto;
  }
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

export { OnBoarding };
