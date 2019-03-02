import React from 'react';
import styled from 'styled-components';
import { StaticQuery, graphql, Link } from 'gatsby';

import MaxWidth from 'common/lib/components/flex/MaxWidth';
import Companies from '../../../components/Companies';

const Container = styled.div`
  background-color: ${({ theme }) => theme.background2};

  padding: 6rem 0;
`;

const Title = styled.h3`
  font-weight: 200;
  font-size: 2rem;
  text-align: center;
  margin-bottom: 0.5rem;
  color: white;
`;

const Button = styled(Link)`
  transition: 0.3s ease all;
  color: white;
  background-color: ${props => props.theme.secondary};
  text-decoration: none;
  padding: 0.5rem 12px;
  text-align: center;
  border-radius: 4px;
  display: block;
  width: 200px;

  margin: auto;
  margin-top: 3rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    box-shadow: 0 7px 12px rgba(0, 0, 0, 0.3);
  }
`;

export default () => (
  <StaticQuery
    query={graphql`
      query {
        allUsersJson(filter: { pinned: { eq: true } }) {
          edges {
            node {
              id
              link
              logoURL
              link
              pinned
            }
          }
        }
      }
    `}
    render={({ allUsersJson: { edges } }) => (
      <Container>
        <MaxWidth width={1280}>
          <Title>Who's using CodeSandbox?</Title>
          <Companies companies={edges} />
          <Button to="/who-uses-codesandbox">More Users</Button>
        </MaxWidth>
      </Container>
    )}
  />
);
