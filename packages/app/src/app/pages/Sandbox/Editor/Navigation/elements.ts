import styled, { css } from 'styled-components';
import { Stack } from '@codesandbox/components';

export const Container = styled(Stack)`
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
    padding: ${theme.space[2]}px;
    border-right: 1px solid
      ${theme.colors.activityBar.border ||
      theme.colors.titleBar.border ||
      'transparent'};
    height: 100%;
    color: ${theme.colors.mutedForeground};
    font-size: 1.4rem;
    background-color: ${theme.colors.activityBar.background};
  `}
`;

export const IconContainer = styled(Stack)<{
  selected: boolean;
  isDisabled: boolean;
}>(
  props => css`
    transition: ${props.theme.speeds[1]}ms ease all;
    height: ${props.theme.space[9]}px;
    width: ${props.theme.space[10]}px;
    color: ${props.theme.colors.activityBar.inactiveForeground};
    cursor: pointer;
    background: transparent;
    border: 0;
    border-radius: ${props.theme.radii.small}px;
    box-sizing: border-box;
    padding: 0;

    &:hover {
      background: ${props.theme.colors.activityBar.hoverBackground};
    }

    &:focus {
      outline: none;
      background: ${props.theme.colors.activityBar.hoverBackground};
    }

    ${props.selected &&
    css`
      color: ${props.theme.colors.activityBar.selectedForeground};
    `};

    ${props.isDisabled &&
    !props.selected &&
    css`
      opacity: 0.4;
    `}
  `
);
