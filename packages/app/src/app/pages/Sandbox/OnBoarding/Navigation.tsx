import React from 'react';

import styled from 'styled-components';

const AbsoluteContainer = styled.div`
  z-index: 9;
  position: absolute;
  top: calc(50% - 44px);
  left: 0;
  right: 0;
  text-align: center;
`;

const HolderActions = styled.div`
  display: inline-flex;
  justify-content: space-between;
  align-items: center;

  width: calc(100vw / 2.8);

  @media screen and (min-width: 1200px) {
    width: calc(100vw / 3.5);
  }

  @media screen and (min-width: 1700px) {
    width: calc(100vw / 4.8);
  }
`;

const Action = styled.button<{ active: boolean }>`
  width: 44px;
  height: 44px;
  border-radius: 44px;
  background: #fff;
  border: 0;
  padding: 0;
  cursor: pointer;

  transition: opacity 0.3s ease;
  opacity: ${({ active }) => (active ? 1 : 0.1)};

  display: flex;

  > * {
    margin: auto;
  }
`;

export const Navigation: React.FC<{
  onPrev: () => void;
  onNext: () => void;
  currentIndex: number;
  maxIndex: number;
}> = ({ onPrev, onNext, currentIndex, maxIndex }) => {
  return (
    <AbsoluteContainer>
      <HolderActions>
        <Action
          active={currentIndex !== 0}
          disabled={currentIndex === 0}
          onClick={onPrev}
          type="button"
          css={{ marginLeft: '-5.5rem' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 18L6.70711 12.7071C6.31659 12.3166 6.31659 11.6834 6.70711 11.2929L12 6"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M20 12L7.1 12"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Action>

        <Action
          active={currentIndex + 1 < maxIndex}
          disabled={currentIndex + 1 === maxIndex}
          onClick={onNext}
          type="button"
          css={{ marginRight: '-5.5rem' }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 6L17.2929 11.2929C17.6834 11.6834 17.6834 12.3166 17.2929 12.7071L12 18"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 12L16.9 12"
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </Action>
      </HolderActions>
    </AbsoluteContainer>
  );
};
