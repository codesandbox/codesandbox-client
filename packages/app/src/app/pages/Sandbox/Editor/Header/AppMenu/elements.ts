import { createElement } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const transitions = keyframes({ from: { opacity: 0 } });

const GlobalMenuStyle = createGlobalStyle`
  [data-menu='AppMenu'] {
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

      animation: ${transitions} 150ms ease-out;
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

  color: ${({ theme }) => theme.colors.grays['300']};
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
    border-color: ${({ theme }) => theme.colors.grays['500']};
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
          return createElement('mnemonic', null, clean(element));
        }

        return element;
      }),
  };
};

export { GlobalMenuStyle, MenuHandler, renderTitle, ToggleBox, HiddenElement };
