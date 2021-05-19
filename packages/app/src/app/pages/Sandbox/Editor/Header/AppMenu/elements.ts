import { createElement } from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export const APP_MENU_ID = 'AppMenu';

const GlobalMenuStyle = createGlobalStyle`
  [data-menu=${APP_MENU_ID}] {
    &[data-component='MenuList'],
    &[data-component='MenuList'] [data-reach-menu-list] {
      overflow: visible !important;
    }

    [data-reach-menu-item] {
      position: relative;
    }

    [data-reach-submenu-list] {
      position: absolute;
      top: -5px;
      left: 100%;
      min-width: 180px !important;

      &:before {
        content: "";
        display: block;
        position: absolute;
        top: 0;
        bottom: 0;
        width: 50px;
        left: -50px;
      }
    }

    @media (max-height: 800px) {
      [data-reach-submenu-list] {
        transform: translateY(calc(-15% + 1px)) !important;
      }
    }

    [data-reach-menu-item][data-component='MenuItem']:hover,
    [data-reach-menu-item][data-component='MenuItem'][data-selected] {
      color: inherit !important;
    }

    [data-reach-menu-item][data-component='MenuItem']:hover >*:not([data-reach-menu-list]) {
      /* TODO: extend the theme type */
      color: ${({ theme }: any) => theme.colors.white} !important;
    }
  }
`;

const MenuHandler = styled.button`
  background: none;
  border: 0;
  padding: 0;

  width: ${({ theme }) => theme.sizes[7]}px;
  height: ${({ theme }) => theme.sizes[7]}px;
  display: flex;

  color: ${({ theme }) => theme.colors.activityBar.inactiveForeground};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.small}px;
  border: 1px solid transparent;
  transition: 0.3s ease border;

  margin-right: ${({ theme }) => theme.space[2]}px;
  margin-left: 5px;

  > * {
    margin: auto;
  }

  &:active,
  &:hover,
  &[aria-expanded='true'] {
    outline: none;
    color: ${({ theme }) => theme.colors.menuList.foreground};
    border-color: ${({ theme }) => theme.colors.menuList.foreground}20;
  }
`;

const ToggleBox = styled.div`
  display: inline-block;
  width: 16px;
  height: 12px;

  position: relative;
  top: 1px;
  left: -2px;
  margin-right: 2px;
`;

const HiddenElement = styled.div`
  position: absolute;
  top: -50px;
  right: 0;
  height: 50px;
  width: calc(100% - ${({ theme }) => theme.sizes[7]}px);
`;

const renderTitle = (label: string) => {
  const REGEX_ELEMENT = /&&/;
  const REGEX_ELEMENT_SHORTCUT = /(&&\w)/g;

  const clean = (payload: string) => payload.replace(REGEX_ELEMENT, '').trim();

  const cleanLabel = clean(label);
  const labelSplit = label.split(REGEX_ELEMENT_SHORTCUT);

  return {
    label: cleanLabel,
    renderMnemonic: () =>
      labelSplit.map(element => {
        if (/(&&\w)/g.test(element)) {
          return createElement(
            'mnemonic',
            { key: clean(element) },
            clean(element)
          );
        }

        return element;
      }),
  };
};

export { GlobalMenuStyle, MenuHandler, renderTitle, ToggleBox, HiddenElement };
