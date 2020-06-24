import { graphql, Link } from 'gatsby';
import React, { useState } from 'react';
import { Stack, ListItem, Text, Element } from '@codesandbox/components';
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
    <Layout noWrapperStyling docs>
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
          paddingTop={8}
          css={`
            border-right: 1px solid #242424;
            min-width: 320px;

            @media screen and (max-width: 768px) {
              padding-top: 0;
              border-right: 1px solid #242424;
            }
          `}
        >
          <Stack
            justify="space-between"
            align="center"
            padding={6}
            css={`
              background: #151515;
              cursor: pointer;

              @media screen and (min-width: 900px) {
                display: none;
              }
            `}
            onClick={() => setShowMobileMenu(s => !s)}
          >
            <Text weight="bold">Documentation</Text>

            <svg width={24} height={16} fill="none">
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
                  width={24}
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
              background: transparant;
              width: 100%;
              position: sticky;

              top: 32px;
              transition: all 200ms ease;

              @media screen and (max-width: 900px) {
                height: ${props => (props.showMobileMenu ? '100%' : '0')};
                overflow: hidden;
              }

              @media screen and (max-width: 768px) {
                background: #151515;
              }
            `}
          >
            <header
              css={`
                padding: 0 1.5rem 1rem 1.5rem;
                margin: 2rem 0;
                font-weight: 500;
                color: #999;

                @media screen and (max-width: 768px) {
                  display: none;
                }
              `}
            >
              <h4
                css={`
                  line-height: 1rem;
                  margin-bottom: 0.5rem;
                  color: #fff;
                `}
              >
                Documentation
              </h4>
              <span>Descriptive reference</span>
            </header>

            <ul
              css={`
                padding: 0;
                margin: 0;
              `}
            >
              {docs.map(({ node }) => (
                <>
                  <Link
                    key={node.fields.title}
                    css={`
                      text-decoration: none;
                      margin: 0 0 0.5rem 0;
                      padding: 0;
                    `}
                    to={`docs${node.fields.slug}`}
                  >
                    <ListItem
                      css={`
                        padding: 0 1.5rem;
                        margin: 0;
                        font-weight: 500;

                        :hover {
                          color: white;
                          background: #242424;

                          span {
                            color: white;
                          }
                        }
                      `}
                    >
                      <Text
                        css={`
                          padding: 0;
                          margin: 0;
                        `}
                        variant="muted"
                        style={{
                          color:
                            location.pathname.split('/docs')[1] ===
                              node.fields.slug && 'white',
                          fontWeight:
                            location.pathname.split('/docs')[1] ===
                              node.fields.slug && '500',
                        }}
                      >
                        {node.fields.title}
                      </Text>
                    </ListItem>
                  </Link>

                  <ul
                    css={`
                      margin: 0;
                      padding: 0;
                    `}
                  >
                    {location.pathname.split('/docs')[1] === node.fields.slug &&
                      node.headings.map(heading => (
                        <li
                          css={`
                            padding: 0 2rem;
                            margin: 0;
                            line-height: 2rem;

                            :hover {
                              color: white;
                              background: #242424;

                              a {
                                color: white;
                              }
                            }

                            :last-child {
                              margin-bottom: 1.5rem;
                            }
                          `}
                        >
                          <Link
                            to={`/docs/${node.fields.slug}#${heading.value
                              .split(' ')
                              .join('-')
                              .toLowerCase()}`}
                            css={`
                              text-decoration: none;
                              color: #999;
                              font-weight: 400;
                            `}
                          >
                            {heading.value}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </>
              ))}
            </ul>
          </Element>
        </Stack>

        <Element
          css={`
            position: relative;
            max-width: 768px;
            @media screen and (max-width: 1100px) {
              width: auto;
              padding: 0 2.5rem;
            }

            @media screen and (max-width: 768px) {
              max-width: 100%;
            }\
          `}
          marginX="auto"
          marginTop={15}
        >
          <a
            css={`
              float: right;
              text-decoration: none;
              color: #999;

              @media screen and (max-width: 1100px) {
                position: relative;
                transform: none;
                float: none;
                top: -20px;
              }
            `}
            variant="secondary"
            href={editLink}
            rel="noreferrer noopener"
            target="_blank"
          >
            Edit this page
          </a>

          <Text weight="bold" size={9} block paddingBottom={2}>
            {title}
          </Text>

          <p css=" font-size:1rem; line-height:1.5; margin-bottom:4rem;">
            {description}
          </p>

          <DocumentationContent dangerouslySetInnerHTML={{ __html: html }} />
          <Stack
            justify="space-between"
            align="center"
            paddingY={8}
            marginTop={90}
            css={`
              border-top: 1px solid #242424;
              border-bottom: 1px solid #242424;
              margin: 4rem 0;
            `}
          >
            {prev.fields ? (
              <Element>
                <Link
                  to={`docs${prev.fields.slug}`}
                  css={`
                    text-decoration: none;
                    line-height: 2rem;
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
                  line-height: 2rem;
                `}
              >
                <Link
                  to={`docs${next.fields.slug}`}
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
      filter: {
        fileAbsolutePath: { regex: "/docs/" }
        fields: { slug: { nin: ["/api", "/faqs"] } }
      }
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
