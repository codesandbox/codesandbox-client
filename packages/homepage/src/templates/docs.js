import React from 'react';
import styled, { css } from 'styled-components';
import Link from 'gatsby-link';
import slugify from 'common/utils/slugify';
import theme from 'common/theme';

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

  margin-top: 2rem;
  margin-right: 1rem;

  ul {
    margin-left: 0;
    list-style: none;
  }

  a {
    text-decoration: none;
  }
`;

const PrimaryNavigationLink = styled(Link)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.125rem;
  font-weight: 500;
`;

const SecondaryNavigationLink = styled(Link)`
  transition: 0.3s ease color;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  font-weight: 500;
  margin-left: 1rem;

  &:hover {
    color: white;
  }
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

  code {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.2em 0.4em;
    font-size: 85%;
    margin: 0;
    border-radius: 3px;
  }

  *:last-child {
    margin-bottom: 0;
  }

  .anchor {
    fill: ${props => props.theme.secondary};
  }

  .gatsby-highlight {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.5rem;
    border-radius: 4px;

    code {
      background-color: transparent;
      padding: 0;
      margin: 0;
      font-size: 100%;
    }
  }
`;

const NavigationItem = styled.li`
  margin-bottom: 1rem;
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

  const activeStyle = {
    color: theme.secondary(),
    fontWeight: 700,
  };

  return (
    <Container>
      <TitleAndMetaTags title={`${frontmatter.title} - CodeSandbox`} />
      <PageContainer>
        <DocsContainer>
          <Navigation>
            <ul>
              {docs.map(({ node }) => (
                <NavigationItem key={node.frontmatter.title}>
                  <PrimaryNavigationLink
                    to={node.fields.url}
                    exact
                    activeStyle={activeStyle}
                  >
                    {node.frontmatter.title}
                  </PrimaryNavigationLink>
                  <ul>
                    {node.headings.map(({ value }) => (
                      <li key={value}>
                        <SecondaryNavigationLink
                          to={node.fields.url + `#${slugify(value)}`}
                          exact
                          activeStyle={activeStyle}
                        >
                          {value}
                        </SecondaryNavigationLink>
                      </li>
                    ))}
                  </ul>
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
      sort: { fields: [fileAbsolutePath], order: ASC }
    ) {
      edges {
        node {
          headings(depth: h2) {
            value
          }
          frontmatter {
            title
          }
          fields {
            slug
            url
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
