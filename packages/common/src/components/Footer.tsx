import React from 'react';
import styled from 'styled-components';
import MaxWidth from './flex/MaxWidth';
import Logo from './Logo';

import media from '../utils/media';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 90px;
  width: 100%;
  padding-top: 5rem;
  padding-bottom: 3rem;

  ${media.tablet`
    grid-template-columns: repeat(2, 1fr);
  `};

  ${media.phone`
    grid-template-columns: repeat(1, 1fr);
    margin-bottom: 1rem;
  `};
`;

const Column = styled.div``;

const Title = styled.h5`
  font-size: 1.125rem;
  font-family: Poppins;
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
      color: rgba(255, 255, 255, 1);

      &:hover {
        color: rgba(255, 255, 255, 0.7);
      }
    }
  }
`;

const Background = styled.div`
  position: relative;
  background-color: ${props => props.theme.background2};
  padding: 1rem;
  z-index: 5;
`;

const Name = styled.h3`
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  color: ${props => props.theme.secondary};
  margin: 0;
  padding: 0;
  padding-left: 12px;
  span {
    color: white;
  }
`;

const TagLine = styled.h4`
  font-family: Open Sans;
  font-size: 14px;
  margin: 12px 0 24px;
  max-width: 200px;
  line-height: 24px;
  color: ${props => props.theme.lightText};
`;

export default () => (
  <Background id="footer">
    <MaxWidth width={1280}>
      <React.Fragment>
        <Container>
          <Column>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Logo />
              <Name>
                Code<span>Sandbox</span>
              </Name>
            </div>
            <TagLine>
              Code, prototype, collaborate & share all in the browser.
            </TagLine>
            <a href="/legal" style={{ color: 'white' }}>
              Terms and Privacy
            </a>
          </Column>
          <Column>
            <Title>CodeSandbox</Title>
            <List>
              <li>
                <a href="/s" target="_blank" rel="noopener noreferrer">
                  Create a Sandbox
                </a>
              </li>
              <li>
                <a href="/explore">Explore</a>
              </li>
              <li>
                <a href="/features">Features</a>
              </li>
              <li>
                <a href="/explore">Explore</a>
              </li>

              <li>
                <a href="/patron">Pricing</a>
              </li>
              <li>
                <a href="/search">Search</a>
              </li>
              <li>
                <a href="/docs">Documentation</a>
              </li>
            </List>
          </Column>

          <Column>
            <Title>About</Title>
            <List>
              <li>
                <a href="/about">About</a>
              </li>
              <li>
                <a href="/blog">Blog</a>
              </li>
            </List>
          </Column>

          <Column>
            <Title>Social</Title>
            <List>
              <li>
                <a
                  href="https://twitter.com/codesandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://spectrum.chat/codesandbox"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Spectrum
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
                <li>
                  <a href="mailto:hello@codesandbox.io">Contact Us</a>
                </li>
              </li>
            </List>
          </Column>
        </Container>
      </React.Fragment>
    </MaxWidth>
  </Background>
);
