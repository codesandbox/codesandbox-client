import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AUTO_RUN_TIMER } from './config';

export const Counter: React.FC<{ amount: number; currentIndex: number }> = ({
  amount,
  currentIndex,
}) => (
  <Wrapper>
    {new Array(amount).fill(' ').map((item, index) => (
      <Item
        // eslint-disable-next-line react/no-array-index-key
        key={index}
        active={currentIndex > index}
        style={{ width: `calc(100% / ${amount} - 1rem)` }}
      >
        {currentIndex === index && <AnimatedItem />}
      </Item>
    ))}
  </Wrapper>
);

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;

  height: 2rem;
  align-items: center;
`;

const Item = styled.div<{ active: boolean }>`
  background: rgba(255, 255, 255, ${({ active }) => (active ? 1 : 0.2)});
  height: 2px;
  position: relative;

  transition: opacity 0.3s ease;
`;

const loadAnimation = keyframes`
  0% {
    width: 0%;
  }
  100% {
    width: 100%;
  }
`;

const AnimatedItem = styled.div`
  background: white;
  height: 2px;

  animation: ${loadAnimation} ${AUTO_RUN_TIMER}ms linear forwards;

  position: absolute;
  left: 0;
  top: 0;
`;
