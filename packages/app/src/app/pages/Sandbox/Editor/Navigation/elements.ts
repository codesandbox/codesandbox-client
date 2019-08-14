import styled, { css } from 'styled-components';

export const Container = styled.div`
  ${({
    topOffset,
    bottomOffset,
    theme,
  }: {
    topOffset: number;
    bottomOffset: number;
    theme: any;
  }) => css`
    position: fixed;
    top: ${topOffset}px;
    bottom: ${bottomOffset}px;
    left: 0;
    display: flex;
    flex-direction: column;
    width: 3.5rem;
    flex: 0 0 3.5rem;
    height: 100%;
    color: ${theme[`activityBar.inactiveForeground`] ||
      css`rgba(255, 255, 255, 0.5)`};
    font-size: 1.4rem;
    align-items: center;
    background-color: ${theme[`activityBar.background`] || css`inherit`};
  `}
`;

export const IconContainer = styled.div<{
  selected: boolean;
  isDisabled: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.3s ease all;
  height: 3.5rem;
  width: 3.5rem;
  font-size: 1.875rem;
  color: ${props =>
    props.theme[`activityBar.inactiveForeground`] ||
    css`rgba(255, 255, 255, 0.5)`};
  cursor: pointer;

  &:hover {
    color: ${props => props.theme[`activityBar.foreground`] || css`white`};
  }

  ${props =>
    props.selected &&
    css`
      color: ${props.theme[`activityBar.foreground`] || css`white`};
    `};

  ${props =>
    props.isDisabled &&
    !props.selected &&
    css`
      opacity: 0.4;
    `}
`;

export const Separator = styled.hr`
  width: calc(100% - 20px);
  height: 1px;
  background-color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255,255,255,0.1)'};

  margin: 0.25rem 0;

  outline: none;
  border: none;
`;
