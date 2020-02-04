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
    ${console.log(theme)}
    top: ${topOffset}px;
    bottom: ${bottomOffset}px;
    left: 0;
    width: 56px;
    border-right: 1px solid ${theme.colors.activityBar.border};
    height: 100%;
    color: ${theme.colors.mutedForeground};
    font-size: 1.4rem;
    background-color: ${theme.colors.activityBar.background};
  `}
`;

export const IconContainer = styled.div<{
  selected: boolean;
  isDisabled: boolean;
}>(
  props => css`
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.3s ease all;
    height: ${props.theme.space[9]}px;
    width: ${props.theme.space[10]}px;
    font-size: 1.875rem;
    color: ${props.theme.colors.activityBar.inactiveForeground};
    cursor: pointer;
    background: transparent;
    border: 0;
    appearance: none;
    outline: 0;

    &:hover {
      background: ${props.theme.colors.sideBar.foreground};
    }

    ${props.selected &&
      css`
        color: ${props.theme.colors.white};
      `};

    ${props.isDisabled &&
      !props.selected &&
      css`
        opacity: 0.4;
      `}
  `
);

export const Separator = styled.hr`
  width: calc(100% - 20px);
  height: 1px;
  background-color: ${props => props.theme.colors.sideBar.border};

  margin: 0.25rem 0;

  outline: none;
  border: none;
`;
