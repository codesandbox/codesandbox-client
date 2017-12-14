import React from 'react';
import styled from 'styled-components';

import Link from 'gatsby-link';

import MaxWidth from 'common/components/flex/MaxWidth';

import media from '../utils/media';

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 3rem;
  flex-wrap: wrap;
`;

const Column = styled.div`
  width: calc(33% - 2rem);
  margin: 0 1rem;

  ${media.phone`
    width: 100%;
    margin-bottom: 1rem;
  `};
`;

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

const Authors = styled.div`
  color: white;
  font-size: 0.875rem;
  text-align: right;
`;

const Background = styled.div`
  position: relative;
  background-color: ${props => props.theme.background2.darken(0.2)};
  padding: 1rem;
  z-index: 100;
`;

const BasComponent = () => (
  <a
    id="bas"
    href="https://www.linkedin.com/in/basbuursma/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Bas Buursma
  </a>
);

export default () => (
  <Background id="footer">
    <MaxWidth width={1280}>
      <Container>
        <Column>
          <Title>CodeSandbox</Title>
          <List>
            <li>
              <a href="/s" target="_blank" rel="noopener noreferrer">
                Create Sandbox
              </a>
            </li>
            <li>
              <a href="/search" target="_blank" rel="noopener noreferrer">
                Search
              </a>
            </li>
            <li>
              <Link to="/changelog">Recent Updates</Link>
            </li>
            <li>
              <Link to="/docs">Documentation</Link>
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
            <li>
              <a
                href="https://medium.com/@compuives"
                target="_blank"
                rel="noopener noreferrer"
              >
                Blog
              </a>
            </li>
            <li>
              <a
                href="https://github.com/CompuIves/codesandbox-client"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <a href="mailto:hello@codesandbox.io">Contact Us</a>
            </li>
          </List>
        </Column>

        <Column>
          <Title>Social</Title>
          <List>
            <li>
              <a
                href="https://twitter.com/codesandboxapp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </li>
            <li>
              <a
                href="https://discord.gg/KE3TbEZ"
                target="_blank"
                rel="noopener noreferrer"
              >
                Discord
              </a>
            </li>
          </List>
        </Column>
      </Container>

      <Authors>
        By <BasComponent /> and{' '}
        <a
          id="ives"
          href="https://twitter.com/CompuIves"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ives van Hoorne
        </a>
      </Authors>
    </MaxWidth>
  </Background>
);
