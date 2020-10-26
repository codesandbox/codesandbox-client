import styled, { keyframes } from 'styled-components';

const dropIn = (offset = 100) => keyframes`
  0% { 
    transform: translateY(${offset}px) translateZ(200px);
    filter: blur(20px);
    opacity: 0;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.7);
  }

  70% {
    filter: blur(0);
    opacity: 1;
    box-shadow: 0;
  }

  100% {
    transform: translateZ(0px);
    filter: blur(0);
    opacity: 1;
    box-shadow: 0;
  }
`;

export const EditorElement = styled.img`
  animation: ${props => dropIn(props.i * 250)} 3s;
  animation-delay: ${props => props.i * 100}ms;
  animation-fill-mode: backwards;

  z-index: ${props => props.i};
`;

export const HeroWrapper = styled.section`
  position: relative;
  display: flex;
  justify-content: center;
  text-align: center;
  padding: 10rem 0 5rem 0;
  margin-bottom: 4rem;

  ${props => props.theme.breakpoints.md} {
    padding-top: 5rem;
  }

  > div {
    text-align: center;
    max-width: 80%;
    margin: auto;
  }

  ${props => props.theme.breakpoints.md} {
    > div {
      max-width: 90%;
    }
  }
`;

export const StyledEditorLink = styled.a`
  transition: 0.3s ease opacity;
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 110px;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  transition: 0.3 ease all;
  border-radius: 4px;
  font-size: 1.25rem;
  text-decoration: none;

  color: white;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;

  &:hover {
    opacity: 1;
  }
`;

export const CountText = styled.div`
  font-size: 1.25rem;
  color: #757575;
  margin-bottom: 1.5rem;
  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

export const InspiredText = styled.span`
  transition: 0.3s ease color;
  font-size: 1rem;
  color: #757575;
  margin-bottom: 1rem;
  text-decoration: none;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

export const Title = styled.h1`
  font-size: 3rem;
  line-height: 57px;
  font-family: ${props => props.theme.homepage.appleFont};

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 1.5rem;
  font-weight: 900;

  ${props => props.theme.breakpoints.md} {
    font-size: 3rem;
    line-height: 1.2;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 2rem;
  }
`;

export const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.muted};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;

// All for the B variant for A/B test

export const SandboxButtons = styled.section`
  height: auto;
  width: auto;
  margin: 5rem 0;
  transition: all 200ms ease-in;
  justify-content: center;
  display: flex;
  align-items: center;
`;

export const Sandbox = styled.a`
  display: flex;
  opacity: 0.4;
  border: none;
  background-color: transparent;
  background-size: cover;
  background-position: center center;
  transition: all 200ms ease-in;
  justify-content: center;
  animation: easeInOutBack 1s cubic-bezier(0, -0.6, 0.12, 2) 1s backwards;

  width: 4rem;
  height: 4rem;
  margin: 0 0.5rem;

  ${props => props.theme.breakpoints.md} {
    width: 4rem;
    height: 4rem;
  }

  ${props => props.theme.breakpoints.sm} {
    width: 2rem;
    height: 2rem;
  }

  :hover {
    cursor: pointer;
    animation-play-state: paused;
    transform: scale(1.2);
    opacity: 1;
  }

  @keyframes easeInOutBack {
    0% {
      opacity: 0;
      transform: scale(0.01);
    }

    100% {
      opacity: 0.4;
      transform: scale(1);
    }
  }
`;
