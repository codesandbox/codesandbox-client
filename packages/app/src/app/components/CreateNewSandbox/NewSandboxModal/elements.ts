import styled, { createGlobalStyle } from 'styled-components';
import interCSS from '@codesandbox/common/lib/fonts/Inter/inter.css';
// import delayEffect from '@codesandbox/common/lib/utils/animation/delay-effect';
// import delayOutEffect from '@codesandbox/common/lib/utils/animation/delay-out-effect';

import { Tab as BaseTab, TabList, TabPanel } from 'reakit/Tab';

export const ImportFont = createGlobalStyle`
${interCSS}
`;

export const Container = styled.div<{
  closing: boolean;
  forking: boolean;
}>`
  display: grid;
  grid-template-columns: 176px minmax(640px, 976px);
  min-width: 870px;
  max-width: 1200px;
  min-height: 496px;
  border-radius: 0.25rem;
  background-color: #242424;
  color: #fff;
  border: 1px solid #242424;
  box-shadow: 0px 8px 8px rgba(0, 0, 0, 0.24), 0px 2px 4px rgba(0, 0, 0, 0.12);
  font-family: Inter;

  * {
    box-sizing: border-box;
  }
`;

export const Tabs = styled(TabList)`
  display: flex;
  flex-direction: column;
  background: #242424;
  padding: 1rem 0;
  border-radius: 4px 0 0 4px;
  border-right: 1px solid #040404;
`;

export const Tab = styled(BaseTab)`
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  align-items: center;
  display: flex;
  margin-bottom: 0.5rem;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  cursor: pointer;

  &[aria-selected='true'],
  :hover {
    background: #151515;
  }

  svg {
    margin-right: 0.5rem;
  }
`;

export const TabContent = styled(TabPanel)`
  background: #151515;
  position: relative;
  height: 530px;
  border-radius: 0 4px 4px 0;
`;

export const Header = styled.header`
  font-size: 19px;
  line-height: 24px;
  margin: 1.5rem 1.5rem 0 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #242424;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 500;
  margin-bottom: 2rem;
  min-height: 50px;
`;

export const Legend = styled.span`
  font-size: 16px;
  line-height: 19px;
  color: #757575;
`;

// export const Container = styled.main<{
//   closing: boolean;
//   forking: boolean;
// }>`
//   ${({ closing, forking, theme }) => css`
//     display: flex;
//     flex-direction: column;
//     position: relative;
//     height: 100%;
//     width: 100%;
//     border-radius: 0 0 4px 4px;
//     background-color: ${theme.background};
//     box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
//     color: ${theme.light
//       ? css`rgba(0, 0, 0, 0.7)`
//       : css`rgba(255, 255, 255, 0.7)`};
//     transition: 0.3s ease all;
//     box-sizing: border-box;

//     ${closing &&
//       css`
//         position: relative;
//         width: calc(100% - 2rem);
//         height: calc(100% - 2rem);
//         border: 2px solid ${theme.secondary.clearer(0.2)};
//         border-style: dashed;
//         background-color: ${theme.secondary.clearer(0.9)};
//         overflow: hidden;
//         pointer-events: none;
//       `};

//     ${forking &&
//       css`
//         height: 100%;
//         overflow: hidden;
//       `};
//   `}
// `;

// export const TabContainer = styled.div<{
//   closing: boolean;
//   forking: boolean;
// }>`
//   ${({ closing, forking, theme }) => css`
//     display: flex;
//     align-items: flex-start;
//     width: 100%;
//     border-radius: 8px 8px 0 0;
//     background: ${theme.background2};
//     box-sizing: border-box;

//     ${(closing || forking) &&
//       css`
//         position: absolute;
//         overflow: hidden;
//         ${delayOutEffect(0)};
//       `};
//   `}
// `;
