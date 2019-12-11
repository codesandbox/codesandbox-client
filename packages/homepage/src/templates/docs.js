import { graphql } from 'gatsby';
import React from 'react';
import EditIcon from 'react-icons/lib/go/pencil';

import Layout from '../components/layout';
import DocSearch from '../components/DocSearch';
import PageContainer from '../components/PageContainer';
import StickyNavigation from '../components/StickyNavigation';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import {
  Article,
  Container,
  Description,
  DocsContainer,
  DocsNavigation,
  DocumentationContent,
  Edit,
  Heading,
  Title,
} from './_docs.elements';

const Docs = ({
  data: {
    allDocs: { edges: docs },
    doc: {
      fields: { description, editLink, title },
      html,
    },
  },
}) => (
  <Layout>
    <Container>
      <TitleAndMetaTags
        description={description}
        title={`${title} - CodeSandbox Documentation`}
      />

      <PageContainer>
        <DocsContainer>
          <DocsNavigation>
            <DocSearch />

            <StickyNavigation docs={docs} />
          </DocsNavigation>

          <Article>
            <Heading>
              <Title>{title}</Title>

              <Edit href={editLink} rel="noreferrer noopener" target="_blank">
                <EditIcon /> Edit this page
              </Edit>

              <Description>{description}</Description>
            </Heading>

            <DocumentationContent dangerouslySetInnerHTML={{ __html: html }} />
          </Article>
        </DocsContainer>
      </PageContainer>
    </Container>
  </Layout>
);

export default Docs;

export const pageQuery = graphql`
  query Docs($slug: String!) {
    allDocs: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/docs/" } }
      sort: { fields: [fileAbsolutePath], order: [ASC] }
    ) {
      edges {
        node {
          fields {
            slug
            title
          }
          headings(depth: h2) {
            value
          }
        }
      }
    }
    doc: markdownRemark(
      fileAbsolutePath: { regex: "/docs/" }
      fields: { slug: { eq: $slug } }
    ) {
      fields {
        description
        editLink
        title
      }
      html
    }
  }
`;
