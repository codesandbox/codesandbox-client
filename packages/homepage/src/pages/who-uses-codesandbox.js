import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';
import { Container } from './_explore.elements';

import Companies from '../components/Companies';

const Button = styled.a`
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
  margin-top: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.3);

  &:hover {
    box-shadow: 0 7px 12px rgba(0, 0, 0, 0.3);
  }
`;

export default ({
  data: {
    allUsersJson: { edges },
  },
}) => (
  <Layout>
    <Container>
      <TitleAndMetaTags
        description="Some of the people using codesandbox"
        title="Who is using CodeSandbox? - CodeSandbox"
      />
      <PageContainer as="main" width={1440}>
        <Heading2
          css={`
            text-align: center;
          `}
        >
          Who's using CodeSandbox?
        </Heading2>
        <p
          css={`
            text-align: center;
            color: white;
          `}
        >
          Some amazing companies and projects using CodeSandbox
        </p>
        <Companies companies={edges} />
        <p
          css={`
            margin-top: 4rem;
            text-align: center;
            color: white;
          `}
        >
          Are you using CodeSandbox?
        </p>
        <Button
          href="
        https://github.com/codesandbox/codesandbox-client/blob/master/packages/homepage/content/users.json"
          target="_blank"
          rel="noopener noreferrer"
        >
          Add your company
        </Button>
      </PageContainer>
    </Container>
  </Layout>
);
export const query = graphql`
  {
    allUsersJson {
      edges {
        node {
          id
          name
          link
          logoURL
          link
        }
      }
    }
  }
`;
