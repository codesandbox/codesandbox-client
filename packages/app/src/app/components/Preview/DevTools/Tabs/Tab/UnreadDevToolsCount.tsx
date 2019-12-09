import React from 'react';
import styled from 'styled-components';

import { StatusType } from '../..';

const Container = styled.div<{ unread: number; status: StatusType }>`
  transition: 0.3s ease all;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  margin-left: 0.75rem;
  border-radius: 50%;
  height: 16px;
  width: 16px;
  color: ${({ unread }) =>
    unread === 0 ? 'rgba(255, 255, 255, 0.4)' : 'white'};
  background-color: ${({ status, unread, theme }) => {
    if (unread === 0) {
      return theme.vscodeTheme.type === 'dark'
        ? 'rgba(255, 255, 255, 0.2)'
        : 'rgba(0, 0, 0, 0.2)';
    }
    if (status === 'info') {
      return theme.secondary();
    }
    if (status === 'warning') {
      return theme.primary.darken(0.3)();
    }
    if (status === 'error') {
      return theme.red();
    }
    if (status === 'success') {
      return theme.green();
    }
    return 'black';
  }};
`;

export function UnreadDevToolsCount({ status, unread }) {
  return (
    <Container unread={unread} status={status}>
      {unread}
    </Container>
  );
}
