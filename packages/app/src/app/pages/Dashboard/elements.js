import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
`;

export const LoggedInContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  flex-direction: column;
`;

export const LoggedInTitle = styled.div`
  font-weight: 600;
  margin-bottom: 2rem;
  color: rgba(255, 255, 255, 0.6);
`;

export const LoggedInSubTitle = styled.div`
  font-weight: 500;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

export const NavigationContainer = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
  right: 1rem;
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

export const Sidebar = styled.div`
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
