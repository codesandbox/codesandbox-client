import styled, { css } from 'styled-components';
import CrossIconClean from 'react-icons/lib/md/clear';

export const Container = styled.div`
  display: flex;
  background-color: ${props =>
    props.theme['editorGroupHeader.tabsBackground'] || props.theme.background4};

  width: 100%;
  align-items: center;
  font-size: 0.875rem;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
`;

export const CrossIcon = styled(CrossIconClean)`
  transition: 0.3s ease color;
  position: absolute;
  right: 1rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'};
  cursor: pointer;

  &:hover {
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
  }
`;

export const Tab = styled.div<{ selected: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: 0.2s ease all;
  padding: 0.35rem 0.75rem;
  width: 100%;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  border-right: 1px solid
    ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.4)'};

  ${props =>
    props.selected
      ? css`
          background-color: ${props.theme['tab.activeBackground'] ||
            props.theme.background2};
          color: ${props.theme.light
            ? 'rgba(0, 0, 0, 0.8)'
            : 'rgba(255, 255, 255, 0.9)'};
          font-weight: 400;
        `
      : css`
          border-bottom: 1px solid
            ${props.theme.light ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.4)'};
          &:hover {
            background-color: ${props.theme['tab.inactiveBackground'] ||
              props.theme.background2.darken(0.2)};
            color: ${props.theme.light
              ? 'rgba(0, 0, 0, 0.8)'
              : 'rgba(255, 255, 255, 0.9)'};
          }
        `};
`;

export const PlusContainer = styled.button`
  transition: 0.3s ease all;

  border: 0;
  outline: 0;
  background-color: transparent;
  padding: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  /* This is specific width to align with the arrow above it in devtools */
  min-width: 45px;
  width: 45px;
  height: 100%;

  cursor: pointer;

  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.5)'};

  &:hover {
    background-color: ${props =>
      `${props.theme['tab.activeBackground'] || props.theme.background2}`};
    color: ${props =>
      props.theme.light ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.7)'};
  }
`;
