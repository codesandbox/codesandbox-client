import styled, { css } from 'styled-components';
import Logo from 'common/components/Logo';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
`;

export const Centered = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
`;

export const OffsettedLogo = styled(Logo)`
  margin-top: -110px;
  margin-bottom: 30px;
  color: white;

  background-color: ${props => props.theme.background4};
  width: 75px;
  height: 75px;

  padding: 1rem;
  border-radius: 8px;
`;

export const LoggedInContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  width: 300px;
  margin: 0 auto;

  padding: 4rem;
  border-radius: 4px;
  background-color: ${props => props.theme.background};
`;

export const LoggedInTitle = styled.div`
  font-size: 1.5rem;
  color: ${props => props.theme.new.title};
  font-weight: 600;
  margin-bottom: 2rem;
  font-family: Poppins -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`;

export const LoggedInSubTitle = styled.div`
  font-weight: 500;
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

export const NavigationContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  padding: 1rem;
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
