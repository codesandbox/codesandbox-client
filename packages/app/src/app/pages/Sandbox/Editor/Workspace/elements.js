import styled from 'styled-components';
import fadeIn from 'common/utils/animation/fade-in';

export const getContainerStyles = props => {
  const { theme } = props;
  const color =
    props.color ||
    (props.alternative
      ? theme.primary
      : theme.templateBackgroundColor ||
        theme.templateColor ||
        theme.secondary);
  let styles = `
    ${styleProps => styleProps.noTransition || 'transition: 0.3s ease all;'}
    position: relative;
    display: flex;
    font-size: 14px;
    padding: 0.4rem;
    padding-left: ${
      props.depth != null
        ? `calc(${props.depth + 1}rem - 2px)`
        : 'calc(1rem - 2px)'
    };
    padding-right: 3rem;
    color: ${theme['sideBar.foreground'] ||
      (theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)')};

    text-decoration: none;
    font-weight: 400;
    min-width: 100px;
    border-left: 2px solid transparent;
    cursor: pointer;
    user-select: none;

    &:hover {
      ${
        props.active || props.editing
          ? ''
          : `
        background-color: ${theme['list.hoverBackground'] ||
          color.clearer(0.9)()};
        color: ${theme['list.hoverForeground'] ||
          (theme.light ? '#6c6c6c' : theme.background.lighten(5)())};
        border-color: ${color.darken(0.4)()};
      `
      }

      > div {
        opacity: 1 !important;
      }
    }
  `;

  if (props.editing) {
    styles += `
      color: ${theme.white()};
      background-color: ${color.clearer(0.9)()};
    `;

    if (props.nameValidationError) {
      styles += `
        border-color: ${theme.red()} !important;
        background-color: ${theme['list.invalidItemForeground'] ||
          theme.redBackground.clearer(0.4)()} !important;
      `;
    }
  }

  if (props.active) {
    styles += `
      color: ${theme['list.activeSelectionForeground'] ||
        theme.white()} !important;
      border-color: ${color()} !important;
      background-color: ${theme['list.activeSelectionBackground'] ||
        color.lighten(0.1).clearer(0.8)()} !important;
    `;
  }

  if (props.rightColors) {
    styles += `
      border-right: 2px solid ${props.rightColors[0]};
    `;
  }

  return styles;
};

export const EntryContainer = styled.div`
  ${props => getContainerStyles(props)};
`;

export const Container = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${props =>
    props.theme['sideBar.background'] || props.theme.background};
  color: ${props => props.theme['sideBar.foreground'] || 'inherit'};
  height: 100%;
  width: 100%;
  overflow-y: overlay;
  overflow-x: auto;

  > div {
    ${fadeIn(0)};
  }
`;

export const ContactContainer = styled.div`
  padding: 1rem;
  color: ${props =>
    props.theme.white ? '#636363' : 'rgba(255, 255, 255, 0.6)'};
  font-size: 1.25rem;
`;

export const WorkspaceSubtitle = styled.h4`
  font-size: 0.875rem;
  margin: 0.5rem 0;
  font-weight: 400;
  color: ${props =>
    props.theme.light
      ? props.theme.background3.darken(0.5)
      : props.theme.background3.lighten(0.5)};
  padding: 0 1rem;
`;

export const Icon = styled.div`
  position: relative;
  display: inline-block;
  transition: 0.3s ease color;
  color: ${props =>
    props.theme.light ? '#6c6c6c' : 'rgba(255, 255, 255, 0.5)'};
  padding-left: 0.5rem;
  &:hover {
    color: ${props => (props.theme.light ? 'black' : 'rgba(255, 255, 255, 1)')};
  }
`;

export const IconArea = styled.div`
  position: absolute;
  right: 1rem;
  opacity: 0;
  line-height: 1;
  vertical-align: middle;
  ${fadeIn(0)};
`;

export const WorkspaceInputContainer = styled.div`
  display: inline-block;
  display: flex;
  overflow: visible;
  font-size: 0.875rem;
  margin: 0.5rem 0.75rem;
  input,
  textarea {
    transition: 0.3s ease background-color, 0.3s ease border-color;
    font-family: inherit;
    margin: 0 0.25rem;
    padding: 0.25rem;
    width: 100%;
    outline: none;
    border: none;
    border-radius: 2px;
    background-color: ${props =>
      props.errorMessage
        ? props.theme.redBackground.clearer(0.5)
        : props.theme['input.background'] || 'rgba(0, 0, 0, 0.2)'};
    color: ${props =>
      props.errorMessage
        ? props.theme.red
        : props.theme['input.foreground'] || props.theme.white};
    border: 1px solid transparent;
    &:focus {
      border-color: ${props => props.theme.secondary.clearer(0.5)};
    }
  }
  input::-webkit-input-placeholder {
    color: ${props => props.theme.background2.lighten(2.9)};
  }
`;

export const ItemTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;

  margin: 1rem;
  margin-bottom: 0.5rem;

  color: ${props => props.theme.templateColor || props.theme.secondary};
`;

export const Description = styled.div`
  margin: 0.5rem 1rem;
  line-height: 1.4;
  font-size: 0.875rem;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'};
`;

export const VersionContainer = styled.div`
  display: inline-flex;
  align-items: center;
  float: right;
  font-size: 0.6rem;
  height: 28px;
  vertical-align: middle;
  font-weight: 600;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.3)'};
`;
