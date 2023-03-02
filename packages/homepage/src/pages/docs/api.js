import React, { useState, useEffect } from 'react';
import { graphql, Link } from 'gatsby';
import { Stack, ListItem, Text, Element } from '@codesandbox/components';
import Layout from '../../components/new-layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { APIStyle } from './_global';

const FAQS = ({ data, location }) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [links, setLinks] = useState([]);
  const hash = location.hash ? location.hash.split('#')[1] : '';

  useEffect(() => {
    const allH2 = document
      .getElementsByClassName('html-faq')[0]
      .getElementsByTagName('h2');

    Array.from(allH2).map(link =>
      setLinks(l =>
        l.concat({
          to: link.id,
          text: link.innerText,
        })
      )
    );
  }, []);

  return (
    <Layout noWrapperStyling docs>
      <TitleAndMetaTags
        description="CodeSandbox API Documentation"
        title="CodeSandbox API Documentation"
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
            border-right: 1px solid #343434;
            min-width: 320px;

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
            <Text weight="bold">API Documentation</Text>
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
              background: ${props =>
                props.showMobileMenu ? '#151515 ' : 'transparant'};
              width: 100%;
              position: sticky;
              top: 32px;
              transition: all 200ms ease;

              @media screen and (max-width: 900px) {
                height: ${props => (props.showMobileMenu ? '100%' : '0')};
                overflow: hidden;
              }
            `}
          >
            <header
              css={`
                padding: 0 1.5rem 1rem 1.5rem;
                margin: 2rem 0;
                color: #999;
              `}
            >
              <h4
                css={`
                  line-height: 1rem;
                  margin-bottom: 0.5rem;
                  color: #fff;
                `}
              >
                API reference
              </h4>
              <span>Create sandboxes with code</span>
            </header>

            {links.map(({ to, text }) => (
              <Link
                key={to}
                css={`
                  text-decoration: none;
                `}
                to={`docs/api/#${to}`}
              >
                <ListItem
                  css={`
                    padding: 0 1.5rem;
                    margin: 0;

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
                      color: hash === to && 'white',
                      fontWeight: hash === to && '400',
                    }}
                  >
                    {text}
                  </Text>
                </ListItem>
              </Link>
            ))}
          </Element>
        </Stack>
        <Element
          css={`
            position: relative;
            max-width: 768px;
            @media screen and (max-width: 1100px) {
              width: auto;
              padding: 0 40px;
            }

            @media screen and (max-width: 768px) {
              max-width: 100%;
            }\
          `}
          marginX="auto"
          marginTop={15}
        >
          <Text weight="bold" size={9} block paddingBottom={2}>
            API
          </Text>
          <p css=" font-size:1rem; margin-bottom:4rem;">
            Here you can learn how to use CodeSandbox programmatically
          </p>
          <Element
            className="html-faq"
            dangerouslySetInnerHTML={{ __html: data.api.html }}
            css={APIStyle}
          />
        </Element>
      </Stack>
    </Layout>
  );
};

export const query = graphql`
  {
    api: markdownRemark(fields: { slug: { eq: "/api" } }) {
      fields {
        description
        editLink
        title
      }
      rawMarkdownBody
      html
    }
  }
`;

export default FAQS;
