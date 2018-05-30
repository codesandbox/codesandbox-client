import styled, { css } from 'styled-components';

export const Container = styled.div`
  height: 100%;
  width: 100%;

  color: rgba(255, 255, 255, 0.8);
`;

export const NavigationContainer = styled.div`
  position: absolute;
  left: 1rem;
  top: 1rem;
  right: 1rem;
`;

const paddingTop = css`
  padding-top: 100px;
`;

export const Sidebar = styled.div`
  width: 300px;
  box-sizing: border-box;

  height: 100vh;
  background-color: ${props => props.theme.background};

  ${paddingTop};

  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.3);
`;

export const Content = styled.div`
  ${paddingTop};
  width: 100%;
`;
