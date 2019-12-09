import styled, { css } from 'styled-components';

import { EntryContainer } from '../../../../elements';

export const ChangeContainer = styled.div`
  &:last-child {
    border-bottom: none;
  }
`;

export const Entry = styled(EntryContainer)`
  ${({
    color,
    hideColor,
    theme,
  }: {
    color: string;
    hideColor: boolean;
    theme: any;
  }) => css`
    display: flex;
    align-items: center;
    line-height: 1;
    color: ${theme.vscodeTheme.colors['editor.foreground']};
    ${hideColor &&
      css`
        background-color: transparent;
        padding-left: 0;
      `};

    svg {
      color: ${color};
      margin-right: 0.5rem;
    }
  `}
`;
