import styled, { createGlobalStyle } from 'styled-components';

const GlobalMenuStyle = createGlobalStyle`
  [data-menu='MenuBar'] {
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
    }

    [data-reach-menu-item][data-component='MenuItem']:hover,
    [data-reach-menu-item][data-component='MenuItem'][data-selected] {
      color: inherit !important;
    }

    [data-reach-menu-item][data-component='MenuItem']:hover >*:not([data-reach-menu-list]) {
      color: #fff !important;
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

export { GlobalMenuStyle, MenuHandler };
