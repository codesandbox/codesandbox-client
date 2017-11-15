import React from 'react';
import styled, { css } from 'styled-components';

import Logo from 'common/components/Logo';
import MaxWidth from 'app/components/flex/MaxWidth';

import media from '../utils/media';

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 0;
  width: 100%;
  color: white;
  z-index: 5;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  flex: auto;
`;

const StyledLogo = styled(Logo)`
  ${media.phone`
    width: 38px;
    height: 38px;
  `};
`;

const Item = styled.a`
  transition: 0.2s ease color;
  font-size: 1.125rem;
  text-decoration: none;
  color: white;

  margin: 0 1rem;
  font-weight: 400;

  &:hover {
    color: ${props => props.theme.secondary};
  }

  ${props =>
    props.button &&
    css`
      ${media.phone`
      display: none;
    `};
      padding: 0.35rem 0.8rem;
      border-radius: 4px;
      box-shadow: 0 3px 4px rgba(0, 0, 0, 0.3);
      background-image: linear-gradient(
        45deg,
        ${p => p.theme.secondary.darken(0.1)} 0%,
        ${p => p.theme.secondary} 100%
      );

      &:hover {
        transform: translateY(-10px);
        color: white;
      }
    `};

  ${media.phone`
    font-size: 1rem;
    margin: 0 .5rem;
  `};
`;

const Right = styled.div``;

export default () => (
  <MaxWidth width={1280}>
    <Container>
      <Left>
        <StyledLogo title="CodeSandbox" width={50} height={50} />
      </Left>
      <Right>
        <Item
          href="https://medium.com/@compuives"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog
        </Item>
        <Item
          href="https://github.com/CompuIves/codesandbox-client"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </Item>
        <Item href="/s" target="_blank" rel="noopener noreferrer" button>
          Create Sandbox
        </Item>
      </Right>
    </Container>
  </MaxWidth>
);
