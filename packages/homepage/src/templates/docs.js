import React from 'react';
import styled, { css } from 'styled-components';

import media from '../utils/media';

import TitleAndMetaTags from '../components/TitleAndMetaTags';
import PageContainer from '../components/PageContainer';
import StickyNavigation from '../components/StickyNavigation';

const Container = styled.div`
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
`;

const cardCSS = css`
  background-color: ${props => props.theme.background};
  padding: 1.5rem;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
  border-radius: 2px;
  margin-bottom: 1rem;
`;

const Article = styled.div`
  flex: 3;

  padding-right: 1rem;

  ${media.phone`
    padding-right: 0;
  `};
`;

const DocsContainer = styled.div`
  display: flex;
  ${media.phone`
    flex-direction: column;
  `};
`;

const DocumentationContent = styled.div`
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.8);
  font-feature-settings: normal;

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
    overflow-x: auto;
  }

  iframe {
    nargin-bottom: 1rem;
  }

  code {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.2em 0.4em;
    font-size: 85%;
    margin: 0;
    border-radius: 3px;
  }

  code,
  pre {
    font-family: source-code-pro, Menlo, Monaco, Consolas, Courier New,
      monospace;
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
    margin-bottom: 1rem;

    code {
      background-color: transparent;
      padding: 0;
      margin: 0;
      font-size: 100%;
      height: auto !important;
      line-height: 20px;
      white-space: pre-wrap;
      word-break: break-word;
    }
  }

  .token.attr-name {
    color: ${props => props.theme.secondary};
  }

  .token.tag {
    color: #ec5f67;
  }

  .token.string {
    color: #99c794;
  }

  .token.keyword {
    color: ${props => props.theme.secondary};
  }

  .token.boolean,
  .token.function {
    color: #fac863;
  }

  .token.property,
  .token.attribute {
    color: ${props => props.theme.secondary};
  }

  .token.comment,
  .token.block-comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: #626466;
  }
`;

const Edit = styled.a`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  color: white;
  font-weight: 500;
  font-size: 1.125rem;

  ${media.phone`
    display: none;
  `};
`;

const Heading = styled.div`
  ${cardCSS};
  position: relative;

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

// eslint-disable-next-line
export default class Docs extends React.Component {
  render() {
    const { data } = this.props;

    const { edges: docs } = data.allMarkdownRemark;
    const { html, frontmatter, fields } = data.markdownRemark;

    return (
      <Container style={{ overflowX: 'auto' }}>
        <TitleAndMetaTags
          title={`${frontmatter.title} - CodeSandbox`}
          description={frontmatter.description}
        />
        <PageContainer>
          <DocsContainer>
            <div
              style={{
                flex: 1,
                minWidth: 250,
              }}
            >
              <StickyNavigation docs={docs} />
            </div>
            <Article>
              <Heading>
                <Title>{frontmatter.title}</Title>
                <Edit
                  href={`https://github.com/CompuIves/codesandbox-client/tree/master/packages/homepage/content/${
                    fields.path
                  }`}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  Edit this page
                </Edit>
                <Description>{frontmatter.description}</Description>
              </Heading>

              <DocumentationContent
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </Article>
          </DocsContainer>
        </PageContainer>
      </Container>
    );
  }
}

export const pageQuery = graphql`
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
        path
      }
    }
  }
`;
