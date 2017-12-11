import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'gatsby-link';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';

const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
`;

const cardCSS = css`
  background-color: ${props => props.theme.background};
  padding: 1.5rem;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  margin-bottom: 1rem;
`;

const Navigation = styled.nav`
  flex: 1;

  margin-right: 1rem;
`;

const Article = styled.div`
  flex: 3;
`;

const DocsContainer = styled.div`
  display: flex;
`;

const DocumentationContent = styled.div`
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);

  h2 {
    margin: 1.5rem 0;
    font-weight: 400;
    color: white;

    &:first-child {
      margin-top: 0rem;
    }
  }

  h3 {
    font-weight: 400;
    font-size: 1.25rem;
    color: white;
    margin-top: 2rem;
  }

  section {
    ${cardCSS};
  }

  *:last-child {
    margin-bottom: 0;
  }
`;

const NavigationItem = styled.li`
  margin: 0;
  padding: 0;
  border: 0;
`;

const Heading = styled.div`
  ${cardCSS};

  background-image: linear-gradient(
    -45deg,
    ${({ theme }) => theme.secondary.darken(0.1)()} 0%,
    ${({ theme }) => theme.secondary.darken(0.3)()} 100%
  );
  padding: 1rem 2rem;
  color: white;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 300;
`;

const Description = styled.p`
  font-size: 1.125rem;
  font-weight: 400;

  margin-bottom: 0.25rem;
`;

export default ({ data }) => {
  const { edges: docs } = data.allMarkdownRemark;
  const { html, frontmatter } = data.markdownRemark;

  return (
    <Container>
      <TitleAndMetaTags title={`${frontmatter.title} - CodeSandbox`} />
      <PageContainer>
        <DocsContainer>
          <Navigation>
            <ul style={{ listStyle: 'none' }}>
              {docs.map(({ node }) => (
                <NavigationItem key={node.frontmatter.title}>
                  <Link to={node.fields.slug}>{node.frontmatter.title}</Link>
                </NavigationItem>
              ))}
            </ul>
          </Navigation>
          <Article>
            <Heading>
              <Title>{frontmatter.title}</Title>
              <Description>{frontmatter.description}</Description>
            </Heading>

            <DocumentationContent dangerouslySetInnerHTML={{ __html: html }} />
          </Article>
        </DocsContainer>
      </PageContainer>
    </Container>
  );
};

export const query = graphql`
  query Docs($slug: String!) {
    allMarkdownRemark(
      filter: { id: { regex: "/docs/" } }
      sort: { fields: [fields___date], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
          }
          fields {
            slug
          }
        }
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        description
      }
      fields {
        slug
      }
    }
  }
`;
