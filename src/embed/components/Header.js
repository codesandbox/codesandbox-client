import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  height: 3rem;
  line-height: 3rem;
  padding: 0 1rem;
  box-sizing: border-box;
  border-bottom: 1px solid ${props => props.theme.background2};
  background-color: ${props => props.theme.background};
`;

export default ({ sandbox }) => <Container>{sandbox.id}</Container>;
