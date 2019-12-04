import styled, { keyframes } from 'styled-components';

export const itemWidth = 324;
export const smallItemHeight = 420;
export const bigItemHeight = 548;
export const viewPortMargin = 60;

export const ImageWrapper = styled.div`
  position: relative;
  margin-top: 2rem;
  height: 900px;
  width: calc(100vw + ${itemWidth + viewPortMargin}px);
  overflow: hidden;

  margin-left: -${itemWidth + viewPortMargin}px;

  ${props => props.theme.breakpoints.lg} {
    max-width: 100%;
  }

  ${props => props.theme.breakpoints.md} {
    margin-top: 0;
  }

  > section {
    display: flex;
    align-items: center;
  }

  img {
    cursor: pointer;
    max-width: initial;
  }

  div > div {
    margin-bottom: 2rem;
  }

  div {
    margin: 1rem;
  }

  &::-webkit-scrollbar {
    width: 0.5em;
    height: 0.5em;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

export const Button = styled.button`
  border: 0;
  background: transparent;
  padding: 0;
  margin: 0;
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(10px);
  }

  50% {
    transform: translateY(-10px);
  }

  100% {
    transform: translateY(10px);
  }
`;

export const Wrapper = styled.div`
  animation: 7s ${floatAnimation} infinite;
  animation-delay: ${props => (props.index || 0) * 500}ms;
  animation-timing-function: ease;

  position: absolute;
  left: ${props => props.index * 334}px;
  top: 0;

  width: ${itemWidth}px;
  height: ${props =>
    props.big ? bigItemHeight + 'px' : smallItemHeight + 'px'};

  ${props => props.theme.breakpoints.md} {
    width: ${itemWidth * 0.7}px;
    height: ${props =>
      props.big ? bigItemHeight * 0.7 : smallItemHeight * 0.7}px;
  }

  ${props => props.theme.breakpoints.sm} {
    width: ${itemWidth * 0.5}px;
    height: ${props =>
      props.big ? bigItemHeight * 0.5 : smallItemHeight * 0.5}px;
  }
`;

export const Image = styled.img`
  ${props => props.theme.breakpoints.md} {
    width: ${itemWidth * 0.7}px;
    height: ${props =>
      props.big ? bigItemHeight * 0.7 : smallItemHeight * 0.7}px;
  }

  ${props => props.theme.breakpoints.sm} {
    width: ${itemWidth * 0.5}px;
    height: ${props =>
      props.big ? bigItemHeight * 0.5 : smallItemHeight * 0.5}px;
  }
`;

export const Iframe = styled.iframe`
  width: ${itemWidth}px;
  height: ${props =>
    props.big ? bigItemHeight + 'px' : smallItemHeight + 'px'};
  border: 0;
  border-radius: 4;
  overflow: hidden;
`;
