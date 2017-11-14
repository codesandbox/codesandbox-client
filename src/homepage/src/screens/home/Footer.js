import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'app/components/flex/MaxWidth';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

const Column = styled.div`flex: 1;`;

const Title = styled.h5`
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.secondary};
`;

const List = styled.ul`color: rgba(255, 255, 255, 0.7);`;

const Background = styled.div`
  background-color: ${props => props.theme.background2.darken(0.2)};
  padding: 2rem;
`;

export default () => (
  <Background>
    <MaxWidth width={1280}>
      <Container>
        <Column>
          <Title>About</Title>
          <List>
            <li>Cookie</li>
            <li>Cookie 2</li>
            <li>Cookie 3</li>
          </List>
        </Column>

        <Column>
          <Title>Social</Title>
          <List>
            <li>Cookie</li>
            <li>Cookie 2</li>
            <li>Cookie 3</li>
          </List>
        </Column>

        <Column>
          <Title>Community</Title>
          <List>
            <li>Cookie</li>
            <li>Cookie 2</li>
            <li>Cookie 3</li>
          </List>
        </Column>
      </Container>
    </MaxWidth>
  </Background>
);
