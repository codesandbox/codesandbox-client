import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
`;

export const ShowSidebarButton = styled.button`
  display: none;
  transition: opacity 200ms ease;
  border: none;
  background-color: rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    display: block;
  }
`;

const paddingTop = css`
  padding-top: 100px;
`;

export const Sidebar = styled.div<{ active: boolean }>`
  display: flex;
  box-sizing: border-box;

  height: 100vh;
  background-color: ${props => props.theme.background};

  ${paddingTop};

  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    width: 0;
    position: fixed;
    transition: width 200ms ease;
    z-index: 1;

    ${props =>
      props.active &&
      css`
        width: 275px;
      `};
  }
`;

export const Content = styled.div`
  ${paddingTop};

  box-sizing: border-box;
  height: 100vh;
  overflow-y: auto;
  width: 100%;
`;
