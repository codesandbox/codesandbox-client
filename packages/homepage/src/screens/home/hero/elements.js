import styled, { keyframes } from 'styled-components';

const dropIn = (offset = 100) => keyframes`
  0% { 
    transform: translateY(${offset}px) translateZ(200px);
    filter: blur(20px);
    opacity: 0;
    box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.5);
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

const fadeIn = () => keyframes`
  0% { 
    opacity: 0;
  }

  100% {
    opacity: 1;
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

  text-align: center;
  overflow: hidden;
  padding: 0 2rem;

  height: calc(100vh - 48px);
  min-height: 800px;

  perspective: 1000;
`;

export const SignUp = styled.p`
  font-size: 13px;
  line-height: 0.8125rem;
  text-align: center;
  margin-top: 0.5rem;
  color: #999;
  margin-bottom: 2.5rem;
`;

export const ImageWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: max-content;

  text-align: left;
  transform-origin: 50% 50%;
  transform: scale(0.75, 0.75) translate(500px, -250px) rotateY(-10deg)
    rotateX(5deg);
  perspective: 100;
  border-radius: 2px;

  &::after {
    animation: ${fadeIn()} 1s;
    animation-delay: 3s;
    animation-fill-mode: backwards;
    content: '';
    display: block;
    position: absolute;
    bottom: 0;
    background-image: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0) 0,
      #040404 90%,
      #040404 100%
    );

    height: 800px;
    width: 100%;

    z-index: 10;
  }
`;

export const Border = styled.div`
  position: absolute;
  background: ${props => props.theme.homepage.grey};
  left: 0;
  width: 100%;
  height: 1px;
`;

export const StyledEditorLink = styled.a`
  transition: 0.3s ease opacity;
  position: absolute;
  display: flex;
  justify-content: center;
  padding-top: 150px;
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

export const HeroBottom = styled.div`
  position: absolute;
  bottom: -30%;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ${props => props.theme.breakpoints.sm} {
    padding: 0 0.5rem;
    line-height: 1.4;
    bottom: -50px;
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

export const HeroImage = styled.img`
  max-width: 1200px;
  min-width: 100%;
  overflow: hidden;
  border-radius: 4px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.5);

  ${props => props.theme.breakpoints.md} {
    width: 120vw;
  }
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  line-height: 57px;
  font-family: ${props => props.theme.homepage.appleFont};

  color: ${props => props.theme.homepage.white};
  padding: 0;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 500;

  ${props => props.theme.breakpoints.md} {
    font-size: 1.8rem;
    line-height: 1.2;
  }

  ${props => props.theme.breakpoints.sm} {
    font-size: 1.4rem;
  }
`;

export const SubTitle = styled.h2`
  font-weight: normal;
  font-size: 1.125rem;
  line-height: 1.3;
  color: ${props => props.theme.homepage.white};
  margin: 0;
  margin-bottom: 1rem;

  ${props => props.theme.breakpoints.sm} {
    font-size: 0.875rem;
  }
`;
