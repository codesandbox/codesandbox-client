import styled, { createGlobalStyle } from 'styled-components';

const GlobalMenuStyle = createGlobalStyle`
  [data-component='MenuList'][data-menu='MenuBar'],
  [data-component='MenuList'][data-menu='MenuBar'] [data-reach-menu-list] {
    overflow: visible !important;
  }

  [data-menu='MenuBar'] [data-reach-submenu-list] {
    position: absolute;
    top: -5px;
    left: 100%;
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
