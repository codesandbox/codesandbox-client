import styled, { keyframes } from 'styled-components';

const fadeInAnimation = keyframes`
  0%   { opacity: 0 }
  100% { opacity: 1 }
`;

export const Container = styled.div`
  height: 100%;
  width: 100%;
  background-color: white;

  flex-direction: column;

  position: relative;
  flex: 1;
  display: ${props => (props.hide ? 'none' : 'flex')};
`;

export const StyledFrame = styled.iframe`
  border-width: 0px;
  width: 100%;
  height: 100%;
  min-height: 0;
  overflow: auto;
`;

export const Loading = styled.div`
  animation: ${fadeInAnimation} 0.2s;
  animation-fill-mode: forwards;
  position: absolute;
  top: 2.5rem;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.75);
  padding: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 2rem;
  font-weight: 300;
  color: white;
  line-height: 1.3;
  text-align: center;

  z-index: 10;
`;
