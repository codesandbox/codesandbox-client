import styled, { css } from 'styled-components';

export const TabButton = styled.button`
  background: transparent;
  padding: 0;
  color: inherit;
  border: none;
  font-size: 19px;
  padding-bottom: 12px;
  outline: none;
  cursor: pointer;
  ${props =>
    props.active &&
    css`
      color: white;
    `};
`;

export const Tab = styled.li`
  border-bottom: 1px solid ${props => props.theme.homepage.muted};
  color: ${props => props.theme.homepage.muted};
  padding-right: 13px;
  padding-left: 13px;

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
  margin: 0;

  li:last-child {
    padding-left: 13px;
  }

  li:first-child {
    padding-right: 13px;
  }
`;

export const TabsWrapper = styled.div`
  opacity: 0;
  transition: all 0.2s ease;
  transition-delay: 1s;

  ${props =>
    props.active &&
    css`
      opacity: 1;
    `}
`;

export const VideoComponent = styled.video`
  margin: 40px auto;
  display: block;
  opacity: 0.6;
  transform: rotateX(60deg) rotateY(0deg) rotateZ(45deg) scale(1.2)
    translateY(-200px);
  max-width: 100%;
  transition: all 1s cubic-bezier(0.85, 0, 0.15, 1);

  ${props =>
    props.active &&
    css`
      opacity: 1;
      transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1);
    `}
`;
