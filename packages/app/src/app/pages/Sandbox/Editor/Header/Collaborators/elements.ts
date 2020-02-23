import styled, { css } from 'styled-components';
import { Stack } from '@codesandbox/components';

export const Container = styled(Stack)`
  background-color: ${({ theme }) => theme.colors.dialog.background};
  color: ${({ theme }) => theme.colors.dialog.foreground};
  width: 100%;

  border: 1px solid ${({ theme }) => theme.colors.dialog.border};
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
