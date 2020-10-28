import styled, { css, keyframes } from 'styled-components';

export const TabButton = styled.button`
  background: transparent;
  padding: 0;
  color: inherit;
  border: none;
  font-size: 19px;
  padding-bottom: 12px;
  outline: none;
  cursor: pointer;
  transition: color 300ms ease;
  ${props =>
    props.active &&
    css`
      color: white;
    `};
`;

export const Tab = styled.li`
  border-bottom: 1px solid rgb(52, 52, 52);
  color: ${props => props.theme.homepage.muted};
  padding-right: 1.25rem;
  padding-left: 1.25rem;
  white-space: nowrap;
  margin-bottom: 4px;

  ${props =>
    props.active &&
    css`
      border-color: white;
    `}
`;

export const Tabs = styled.ul`
  display: flex;
  justify-content: center;
  list-style: none;
  margin: auto;
  max-width: 80%;

  li:last-child {
    padding-left: 13px;
  }

  li:first-child {
    padding-right: 13px;
  }

  /* hide scrollbar - webkit */
  &::-webkit-scrollbar {
    height: 0;
  }
  /* hide scrollbar - firefox */
  scrollbar-width: none;

  ${props => props.theme.breakpoints.sm} {
    max-width: 100%;
    justify-content: flex-start;
    overflow: scroll;

    :after {
      content: '';
      position: absolute;
      right: 0;
      display: block;
      height: 3rem;
      width: 5rem;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 1) 100%
      );
    }
  }
`;

export const TabsWrapper = styled.div`
  visibility: hidden;
  opacity: 0;
  transition: all 0.2s ease;
  transition-delay: 0.8s;
  height: 0;

  ${props => props.theme.breakpoints.md} {
    visibility: visible;
    opacity: 1;
    height: 280px;
  }
  ${props => props.theme.breakpoints.xs} {
    height: 320px;
  }

  ${props =>
    props.active &&
    css`
      visibility: visible;
      opacity: 1;
    `}
`;

export const VideoComponent = styled.video`
  margin: 40px auto;
  display: block;
  max-width: 100%;
  transition: all 1.2s cubic-bezier(0.85, 0, 0.15, 1);
  border: 1px solid rgb(36, 36, 36);
  box-shadow: 0px 9.55893px 19.1179px rgba(0, 0, 0, 0.24),
    0px 9.55893px 4.77946px rgba(0, 0, 0, 0.12);
  border-radius: 4px;

  transform: rotateX(60deg) rotateY(0deg) rotateZ(45deg) scale(1.2)
    translateY(-200px);
  opacity: 0.6;
  margin-bottom: 230px;

  ${props => props.theme.breakpoints.md} {
    transform: none;
    opacity: 1;
    margin-bottom: 0;
  }

  ${props =>
    props.active &&
    css`
      opacity: 1;
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)
        translateY(230px);

      ${props.theme.breakpoints.md} {
        transform: none;
      }
    `}
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Paragraph = styled.p`
  animation: 300ms ${fadeIn} ease-out;
  text-align: center;
  width: 604px;
  max-width: 100%;
  margin: auto;
  font-size: 19px;
  line-height: 23px;
  text-align: center;
  margin-top: 40px;
  min-height: 46px;
`;
