// @flow
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;

  margin-left: 0.25rem;

  border-radius: 50%;
  height: 16px;
  width: 16px;

  color: white;
  background-color: ${({ status, theme }) => {
    if (status === 'info') {
      return theme.secondary();
    } else if (status === 'warning') {
      return theme.primary();
    } else if (status === 'error') {
      return theme.red();
    }

    return 'black';
  }};
`;

type Props = {
  status: 'info' | 'warning' | 'error',
  unread: number,
};

export default ({ status, unread }: Props) => (
  <Container status={status}>{unread}</Container>
);
