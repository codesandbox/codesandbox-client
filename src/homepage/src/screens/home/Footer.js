import React from 'react';
import styled from 'styled-components';

import MaxWidth from 'app/components/flex/MaxWidth';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 3rem;
`;

const Column = styled.div`flex: 1;`;

const Title = styled.h5`
  font-size: 1.125rem;
  font-weight: 400;
  margin: 0;
  margin-bottom: 1rem;

  color: ${({ theme }) => theme.secondary};
`;

const List = styled.ul`
  color: rgba(255, 255, 255, 0.7);
  list-style-type: none;
  margin: 0;
  padding: 0;

  li {
    a {
      transition: 0.3s ease color;
      text-decoration: none;
      color: rgba(255, 255, 255, 0.7);

      &:hover {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
`;

const Background = styled.div`
  background-color: ${props => props.theme.background2.darken(0.2)};
  padding: 2rem;
`;

export default () => (
  <Background>
    <MaxWidth width={1280}>
      <Container>
        <Column>
          <Title>CodeSandbox</Title>
          <List>
            <li>
              <a href="/s/new" target="_blank" rel="noopener noreferrer">
                Create A Sandbox
              </a>
            </li>
            <li>
              <a href="/search" target="_blank" rel="noopener noreferrer">
                Search
              </a>
            </li>
            <li>
              <a href="/patron" target="_blank" rel="noopener noreferrer">
                Patron
              </a>
            </li>
          </List>
        </Column>

        <Column>
          <Title>About</Title>
          <List>
            <li>Blog</li>
            <li>GitHub</li>
          </List>
        </Column>

        <Column>
          <Title>Social</Title>
          <List>
            <li>Twitter</li>
            <li>Discord</li>
          </List>
        </Column>
      </Container>
    </MaxWidth>
  </Background>
);
