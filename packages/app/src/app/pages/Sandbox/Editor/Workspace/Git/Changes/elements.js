import React from 'react';
import styled, { css } from 'styled-components';
import { EntryContainer } from '../../elements';

function BaseChangeContainer({ color, ...props }) {
  return <div {...props} />;
}

export const ChangeContainer = styled(BaseChangeContainer)`
  &:last-child {
    border-bottom: none;
  }
`;

export const Entry = styled(EntryContainer)`
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
