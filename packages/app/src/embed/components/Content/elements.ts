import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  position: relative;
  background-color: ${props => props.theme['editor.background']};
  /* if the header is visible, we offset the height to make room for it */
  height: ${props => `calc(100% - ${props.offsetHeight})`};
`;

export const Tabs = styled.div`
  display: flex;
  height: 35px;
  min-height: 35px;
  background-color: ${props => props.theme['tab.inactiveBackground']};
  /* shadow instead of border to align with the border of the child tab */
  box-shadow: inset 0px -1px 0 ${props => props.theme['sideBar.border']};
  overflow-x: auto;
  font-size: 0.875rem;

  -ms-overflow-style: none; // IE 10+
  overflow: -moz-scrollbars-none; // Firefox

  &::-webkit-scrollbar {
    height: 2px; // Safari and Chrome
  }

  /* override children, bad but vscode doesnt support
     tab.hoverForeground :shrug:
  */
  > div:hover > div {
    color: white !important;
  }
`;

export const MenuInTabs = styled.span`
  display: inline-flex;
  height: 100%;
  align-items: center;
  padding-left: 8px;
`;
