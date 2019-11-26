import styled, { css } from 'styled-components';
import { Menu, MenuItem, MenuSeparator } from 'reakit/Menu';
import { withoutProps } from '../../utils';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const MenuButton = styled.button`
  ${({ theme }) => css`
    display: inline-flex;
    padding: 0;
    margin: 0;
    border: none;
    background: none;
    box-sizing: border-box;
    cursor: pointer;

    &:focus {
      outline: none;
    }
  `}
`;

export const List = styled(Menu).attrs({
  modal: false,
  style: { top: '40px', left: 'inherit', right: '0px', transform: 'none' },
})`
  z-index: 999;
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
  min-width: 100px;
  border: 1px solid #242424;
  border-radius: 4px;
  background-color: #151515;
  box-shadow: rgba(0, 0, 0, 0.75) 0px 3px 8px;
  animation: 0.3s ease 0s 1 normal forwards running dXMxHg;
  white-space: nowrap;

  &:focus {
    outline: none;
  }
`;

export const Separator = styled(MenuSeparator)`
  width: 100%;
  height: 1px;
  margin: 0;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  background-color: #242424;
  outline: 0px;
`;

export const Item = styled(withoutProps(`danger`)(MenuItem))`
  ${({ danger = false }) => css`
    display: flex;
    align-items: center;
    padding: 0.5rem 1rem;
    margin: 0;
    border: none;
    background: none;
    color: ${danger ? css`#E1270E` : css`#fff`};
    text-decoration: none;
    transition: all 0.3s ease 0s;
    cursor: pointer;

    &:disabled {
      color: #757575;
      cursor: initial;
    }

    &:focus {
      outline: none;
    }

    &:hover:not(:disabled),
    &:focus:not(:disabled) {
      background-color: #242424;
      color: white;
    }
  `}
`;

export const MenuIcon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 12px;
  font-size: 14px;
`;
