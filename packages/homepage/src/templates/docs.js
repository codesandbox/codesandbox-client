import { graphql, Link } from 'gatsby';
import React, { useState } from 'react';
import {
  Stack,
  ListItem,
  Text,
  Element,
  Button,
} from '@codesandbox/components';
import Layout from '../components/new-layout';
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
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  return (
    <Layout noWrapperStyling>
      <TitleAndMetaTags
        description={description}
        title={`${title} - CodeSandbox Documentation`}
      />
      <Stack
        css={`
          @media screen and (max-width: 900px) {
            flex-direction: column;
          }
        `}
      >
        <Stack
          direction="vertical"
          paddingY={8}
          css={`
            border-right: 1px solid #343434;
            min-width: 320;

            @media screen and (max-width: 900px) {
              padding-top: 0;
            }
          `}
        >
          <Stack
            justify="space-between"
            align="center"
            padding={4}
            css={`
              background: #151515;
              box-shadow: 0px 1px 0px #242424;
              cursor: pointer;

              @media screen and (min-width: 900px) {
                display: none;
              }
            `}
            onClick={() => setShowMobileMenu(s => !s)}
          >
            <Text weight="bold">Documentation</Text>
            <svg width={28} height={18} fill="none">
              <g filter="url(#prefix__filter0_d)">
                <path
                  d="M24 1.053L22.788 0l-9.091 7.895L5.212.526 4 1.58 13.697 10 24 1.053z"
                  fill="#E6E6E6"
                />
              </g>
              <defs>
                <filter
                  id="prefix__filter0_d"
                  x={0}
                  y={0}
                  width={28}
                  height={18}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  />
                  <feOffset dy={4} />
                  <feGaussianBlur stdDeviation={2} />
                  <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow"
                  />
                  <feBlend
                    in="SourceGraphic"
                    in2="effect1_dropShadow"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </Stack>
          <Element
            showMobileMenu={showMobileMenu}
            css={`
              width: 320px;
              position: sticky;
              top: 32px;
              transition: all 200ms ease;

              @media screen and (max-width: 900px) {
                height: ${props => (props.showMobileMenu ? '100%' : '0')};
                overflow: hidden;
              }
            `}
          >
            {docs.map(({ node }) => (
              <Link
                key={node.fields.title}
                css={`
                  text-decoration: none;
                `}
                to={`docs/${node.fields.slug}`}
              >
                <ListItem
                  css={`
                    padding: 0 16px;
                    :hover {
                      color: white;
                      background: #242424;

                      span: {
                        color: white;
                      }
                    }
                  `}
                >
                  <Text
                    variant="muted"
                    style={{
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
                  css={`
                    text-decoration: none;
                  `}
                >
                  <Text
                    size={6}
                    block
                    css={`
                      color: white;
                    `}
                  >
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
              <Element
                css={`
                  text-align: right;
                `}
              >
                <Link
                  to={`docs/${next.fields.slug}`}
                  css={`
                    text-decoration: none;
                  `}
                >
                  <Text
                    size={6}
                    block
                    css={`
                      color: white;
                    `}
                    align="right"
                  >
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
};

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
