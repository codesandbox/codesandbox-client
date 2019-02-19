import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import { Heading2 } from '../components/headings';
import Layout from '../components/layout';
import { Container } from './_explore.elements';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
}

const Grid = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  grid-gap: 30px;
  align-items: center;
  margin-top: 60px;

  img {
    display: block;
    max-width: 80%;
    margin: auto;
  }
`;

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
        <Grid>
          {shuffleArray(edges).map(({ node: company }) => (
            <div>
              <a href={company.link} target="_blank" rel="noopener noreferrer">
                <img height="150" src={company.logoURL} alt={company.name} />
              </a>
            </div>
          ))}
        </Grid>
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
        https://github.com/CompuIves/codesandbox-client/blob/master/packages/homepage/content/users.json"
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
