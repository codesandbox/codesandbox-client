import { graphql, Link } from 'gatsby';
import React from 'react';
import {
  Stack,
  ListItem,
  Text,
  Element,
  Button,
} from '@codesandbox/components';
import Layout from '../components/new-layout';
// import DocSearch from '../components/DocSearch';
import TitleAndMetaTags from '../components/TitleAndMetaTags';

import { DocumentationContent } from './_docs.elements';

const Docs = ({
  location,
  pageContext: { prev, next },
  data: {
    allDocs: { edges: docs },
    doc: {
      fields: { description, editLink, title },
      html,
    },
  },
}) => (
  <Layout noWrapperStyling>
    <TitleAndMetaTags
      description={description}
      title={`${title} - CodeSandbox Documentation`}
    />
    <Stack>
      <Stack
        direction="vertical"
        paddingY={8}
        style={{ borderRight: '1px solid #343434', minWidth: 320 }}
      >
        <Element
          css={`
            position: sticky;
            top: 32px;
          `}
        >
          {docs.map(({ node }) => (
            <Link
              key={node.fields.title}
              style={{ textDecoration: 'none' }}
              to={`docs/${node.fields.slug}`}
            >
              <ListItem
                css={{
                  padding: '0 16px',
                  ':hover': {
                    color: 'white',
                    background: '#242424',

                    span: {
                      color: 'white',
                    },
                  },
                }}
              >
                <Text
                  variant="muted"
                  css={{
                    color:
                      location.pathname.split('/docs')[1] ===
                        node.fields.slug && 'white',
                    fontWeight:
                      location.pathname.split('/docs')[1] ===
                        node.fields.slug && 'bold',
                  }}
                >
                  {node.fields.title}
                </Text>
              </ListItem>
            </Link>
          ))}
        </Element>
      </Stack>
      <Element
        css={`
          position: relative;
          max-width: 709px;
          @media screen and (max-width: 1100px) {
            width: auto;
            padding: 0 40px;
          }
        `}
        marginX="auto"
        marginTop={15}
      >
        <Button
          css={`
            position: sticky;
            width: auto;
            top: 20px;
            float: right;
            transform: translateX(calc(100% + 66px));

            @media screen and (max-width: 1100px) {
              position: relative;
              transform: none;
            }
          `}
          variant="secondary"
          href={editLink}
          rel="noreferrer noopener"
          target="_blank"
        >
          Edit this page
        </Button>
        <Text weight="bold" size={9} block paddingBottom={2}>
          {title}
        </Text>
        <Text block paddingBottom={8}>
          {description}
        </Text>
        <DocumentationContent dangerouslySetInnerHTML={{ __html: html }} />
        <Stack
          justify="space-between"
          align="center"
          paddingY={8}
          marginTop={90}
          css={`
            border-top: 1px solid #242424;
            border-bottom: 1px solid #242424;
          `}
        >
          {prev.fields ? (
            <Element>
              <Link
                to={`docs/${prev.fields.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Text size={6} block style={{ color: 'white' }}>
                  Previous
                </Text>
                <Text size={3} variant="muted">
                  {prev.fields.title}
                </Text>
              </Link>
            </Element>
          ) : (
            <div />
          )}
          {next.fields ? (
            <Element style={{ textAlign: 'right' }}>
              <Link
                to={`docs/${next.fields.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <Text size={6} block style={{ color: 'white' }} align="right">
                  Next
                </Text>
                <Text size={3} variant="muted">
                  {next.fields.title}
                </Text>
              </Link>
            </Element>
          ) : (
            <div />
          )}
        </Stack>
      </Element>

      {/* <DocSearch /> */}
    </Stack>
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
