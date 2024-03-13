import styled, { css as styledcss, keyframes } from 'styled-components';
import Color from 'color';
import { Element } from '../Element';

// export interface ITextProps extends React.HTMLAttributes<HTMLSpanElement> {}

const pulse = keyframes`
  0% { background-position: 100% 50%; }
  100% { background-position: -20% 50%; }
`;

export const SkeletonText = styled(Element)(props => {
  const color = props.theme.colors.sideBar.border;
  const themeType = props.theme.type || props.theme.vscodeTheme.type;

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
  const highlightLuminosity = themeType === 'light' ? 88 : 18;

  // @ts-ignore - we have multiple versions of color in the app
  // which leads to confusing type checks
  const [h, s] = Color(color).hsl().color;

  const background = Color({ h, s, l: backgroundLuminosity }).string();
  const highlight = Color({ h, s, l: highlightLuminosity }).string();

  return styledcss`
      height: 16px;
      width: 200px;
      border-radius: 2px;
      opacity: 0.7;
      animation: ${pulse} 2s linear infinite;
      background: linear-gradient(
        90deg,
        ${background} 0%,
        ${background} 40%,
        ${highlight} 50%,
        ${background} 60%,
        ${background} 100%
      );
      background-size: 200% 200%;
    `;
});
