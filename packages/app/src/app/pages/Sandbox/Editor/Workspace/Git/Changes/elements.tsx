import * as React from 'react';
import styled, { css } from 'app/styled-components';
import { EntryContainer, EntryContainerProps } from '../../elements';

export const ChangeContainer = styled.div`
    &:last-child {
        border-bottom: none;
    }
`;

export const Entry = styled<
    {
        hideColor: boolean;
        color: string;
    } & EntryContainerProps
>(({ hideColor, color, ...rest }) => <EntryContainer {...rest} />)`
  display: flex;
  align-items: center;
  line-height: 1;

  ${({ hideColor }) =>
      hideColor &&
      css`
          background-color: transparent;
          padding-left: 0;
      `};

  svg {
    color: ${({ color }) => color};
    margin-right: 0.5rem;
  }
`;
