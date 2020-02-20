import styled, { css } from 'styled-components';
import { Stack, Element } from '@codesandbox/components';

export const Container = styled(Stack)`
  background-color: ${({ theme }) => theme.colors.dialog.background};
  color: ${({ theme }) => theme.colors.dialog.foreground};
  width: 100%;
  min-height: 300px;

  border: 1px solid ${({ theme }) => theme.colors.dialog.border};
`;

export const DropdownList = styled(Stack)`
  position: absolute;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.dialog.background};
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
  list-style-type: none;
  padding-left: 0;
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes[3]}px;

  border-bottom-left-radius: ${({ theme }) => theme.radii.small}px;
  border-bottom-right-radius: ${({ theme }) => theme.radii.small}px;
`;

export const DropdownItem = styled(Element).attrs({ as: 'li' })<{
  isActive: boolean;
}>`
  padding: ${({ theme }) => theme.space[2]}px;
  cursor: pointer;

  &:hover,
  &:focus {
    background-color: ${({ theme }) => theme.colors.grays[500]};
    color: ${({ theme }) => theme.colors.white};
  }
  ${props =>
    props.isActive &&
    css`
      background-color: ${({ theme }) => theme.colors.grays[500]};
      color: ${({ theme }) => theme.colors.white};
    `}
`;

export const HorizontalSeparator = styled.hr<{ margin?: number }>`
  width: 100%;
  height: 1px;
  border: none;
  background-color: ${({ theme }) => theme.colors.dialog.border};
  margin-block-start: 0;
  margin-block-end: 0;

  ${props =>
    props.margin &&
    css`
      margin: ${props.theme.space[props.margin]}px 0;
    `}
`;
