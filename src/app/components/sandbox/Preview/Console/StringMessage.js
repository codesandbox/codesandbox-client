import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;

export default ({ message }: { message: string }) => {
  return <Container>{message}</Container>;
};
