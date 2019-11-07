import React from 'react';
import styled from 'styled-components';
import MaxWidth from '../flex/MaxWidth';
import LinkGroup from './LinkGroup';

import linkGroups from './LinkGroups.json';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 3rem;
  flex-wrap: wrap;
`;

const Background = styled.div`
  position: relative;
  background-color: ${props => props.theme.background2.darken(0.2)};
  padding: 1rem;
  z-index: 5;
`;

export default () => (
  <Background id="footer">
    <MaxWidth width={1280}>
      <Container as="footer">
        {linkGroups.map(group => (
          <LinkGroup key={group.id} {...group} />
        ))}
      </Container>
    </MaxWidth>
  </Background>
);
