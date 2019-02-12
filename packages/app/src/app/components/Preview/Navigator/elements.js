import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  background-color: ${props =>
    props.theme['editorGroupHeader.tabsBackground'] ||
    props.theme.background()};
  padding: 0.5rem;
  align-items: center;
  line-height: 1;
  /* box-shadow: 0 1px 3px #ddd; */
  height: 2.5rem;
  min-height: 2.5rem;
  box-sizing: border-box;
  z-index: 2;
`;

export const Icons = styled.div`
  display: flex;
`;

export const Icon = styled.button`
  display: inline-block;
  border: none;
  background-color: transparent;
  color: ${props =>
    props.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.5rem;
  line-height: 0.5;
  margin: 0 0.1rem;
  vertical-align: middle;
  text-align: center;
  padding: 0;
  outline: none;

  ${props =>
    !props.disabled &&
    `
    &:hover {
      cursor: pointer;
      color: rgba(255, 255, 255, 1);
    }`};

  ${props =>
    props.selected &&
    css`
      color: ${props.theme.templateColor || props.theme.secondary};
    `};
`;

export const AddressBarContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  margin: 0 0.5rem;
`;

export const SwitchContainer = styled.div`
  flex: 0 0 3.5rem;
`;
