import styled, { css, keyframes } from 'styled-components';
import Color from 'color';
import { Element } from '@codesandbox/components';

const pulse = keyframes`
  0% { background-position: 100% 50%; }
  100% { background-position: -100% 50%; }
`;

export const SkeletonTextBlock = styled(Element)(props => {
  let color = props.theme.colors?.sideBar.border || '#242424';
  const themeType = props.theme.vscodeTheme.type;

  /**
   * This is fun,
   * We animate the background gradient to create a pulse animation
   *
   * To support all themes nicely, we can't really pick a value from the theme
   * So, we take the sidebar.border and then change it's luminosity
   * 14% for background and 16% for the pulse highlight on top
   * We need to set the value to 100 - value for light themes
   */

  const backgroundLuminosity = themeType === 'light' ? 86 : 14;
  const highlightLuminosity = themeType === 'light' ? 88 : 16;

  // Color('#ff000033') throws error.
  const colorWithOpacity = color.length === 9;

  if (colorWithOpacity) {
    // remove the opacity
    color = color.slice(0, -2);
  }

  const hsl = Color(color).hsl();

  const background = hsl.lightness(backgroundLuminosity).hsl().string();
  const highlight = hsl.lightness(highlightLuminosity).hsl().string();

  return css`
    height: 16px;
    width: 200px;
    opacity: 0.7;
    animation: ${pulse} 4s linear infinite;
    background: linear-gradient(
      90deg,
      ${background} 0%,
      ${background} 20%,
      ${highlight} 50%,
      ${background} 80%,
      ${background} 100%
    );
    background-size: 200% 200%;
  `;
});

export const SkeletonWrapper = styled.div`
  position: absolute;
  font-family: Inter, sans-serif;
  opacity: 1;
  transition: opacity 0.5s ease-out;
  background-color: ${props =>
    props.theme.colors?.editor?.background || 'black'};
  width: 100%;
  height: 100%;
  display: flex;
  top: 0;
  left: 0;
  z-index: 10;
`;

export const SkeletonExplorer = styled.div`
  flex: 0 0 272px;
  border-right: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
  background-color: ${props =>
    props.theme.colors?.sideBar.background || 'rgba(0, 0, 0, 0.5)'};
  color: ${props => props.theme.colors?.sideBar.foreground || '#ffffff'} + '80';
`;

export const SkeletonEditor = styled.div`
  flex: 1;
  border-right: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonEditorTop = styled.div`
  height: 34px;
  border-bottom: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonDevtools = styled.div`
  flex: 1;
`;
export const SkeletonDevtoolsTop = styled.div`
  height: 34px;
`;
export const SkeletonDevtoolsNavigator = styled.div`
  height: 34px;
  border-bottom: 1px solid
    ${props => props.theme.colors?.sideBar.border || 'rgba(0, 0, 0, 0.5)'};
`;
export const SkeletonDevtoolsIframe = styled.div`
  height: calc(100% - 22px);
  background-color: #fff;
`;
export const SkeletonStatusBar = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 22px;
  background-color: ${props =>
    props.theme.colors?.statusBar.background || 'rgba(0, 0, 0, 0.5)'};
`;
