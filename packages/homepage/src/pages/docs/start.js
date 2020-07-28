import React, { useState, useEffect } from 'react';
import { Link, graphql } from 'gatsby';
import styled from 'styled-components';
import { Element, Stack, Text } from '@codesandbox/components';
import bg from '../../assets/images/bg-docs.png';
import Layout from '../../components/new-layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { Global, FAQStyle } from './_global';
import { useAccordion } from '../../utils/useAccordion';

const Wrapper = styled.div`
  width: 70%;
  margin: auto;
  position: relative;

  @media screen and (max-width: 768px) {
    width: 90%;
  }

  &:before {
    width: 23px;
    height: 24px;
    left: 26px;
    position: absolute;
    content: '';
    z-index: 2;
    top: 15px;
    background-size: cover;
    background-image: url('data:image/svg+xml,%3Csvg width="23" height="24" viewBox="0 0 23 24" fill="none" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath fill-rule="evenodd" clip-rule="evenodd" d="M13.3521 15.2035C11.9439 16.3936 10.1502 17.1065 8.19687 17.1065C3.66986 17.1065 0 13.2771 0 8.55326C0 3.82942 3.66986 0 8.19687 0C12.7239 0 16.3937 3.82942 16.3937 8.55326C16.3937 10.5915 15.7105 12.4632 14.57 13.9326L23 22.7291L21.7821 24L13.3521 15.2035ZM14.6714 8.55326C14.6714 12.2845 11.7726 15.3092 8.19687 15.3092C4.62111 15.3092 1.72239 12.2845 1.72239 8.55326C1.72239 4.82203 4.62111 1.79727 8.19687 1.79727C11.7726 1.79727 14.6714 4.82203 14.6714 8.55326Z" fill="%23757575"/%3E%3C/svg%3E%0A');
  }
`;

const Input = styled.input`
  width: 100%;
  height: 56px;

  background: #ffffff;
  border-radius: 50px;
  color: #757575;
  padding-left: 65px;
  padding-right: 40px;
  border: none;

  

  ::-webkit-input-placeholder {
    font-size: 23px;
    color: #757575;
  }
  ::-moz-placeholder {
    font-size: 23px;
    color: #757575;
  }
  :-ms-input-placeholder {
    font-size: 23px;
    color: #757575;
  }
  :-moz-placeholder {
    font-size: 23px;
    color: #757575;
  }



  }



  @media screen and (max-width: 768px) {
  ::-webkit-input-placeholder {
    font-size: 16px;
    color: #757575;
  }
  ::-moz-placeholder {
    font-size: 16px;
    color: #757575;
  }
  :-ms-input-placeholder {
    font-size: 16px;
    color: #757575;
  }
  :-moz-placeholder {
    font-size: 16px;
    color: #757575;
  }
  }






`;

const IconWrapper = styled(Element)`
  background: ${props => props.bg};

  height: 231px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const GridItem = styled(Element)`
  background: #151515;
  border: 1px solid #242424;
  border-radius: 4px;
  transition: all 200ms ease;

  &:hover {
    transform: scale(0.98);
  }
`;

const Docs = ({ data }) => {
  const [enabled, setEnabled] = useState(true);
  const faq = data.faq.html;
  useAccordion();

  useEffect(() => {
    // Initialize Algolia search.
    if (window.docsearch) {
      window.docsearch({
        apiKey: '45db7de01ac97a7c4c673846830c4117',
        debug: false,
        indexName: 'codesandbox',
        inputSelector: '#algolia-doc-search',
      });
    } else {
      // eslint-disable-next-line
      console.warn('Search has failed to load and now is being disabled');

      setEnabled(false);
    }
  }, []);

  return (
    <Layout noWrapperStyling>
      <TitleAndMetaTags
        description="CodeSandbox Documentation"
        title="CodeSandbox Documentation"
      />
      <Element
        css={`
          padding-top: 6rem;
          width: 1095px;
          max-width: 95%;
          margin: auto;
          background-size: cover;

          @media screen and (max-width: 768px) {
            padding-top: 60px;
          }

          .algolia-autocomplete {
            width: 100%;
          }
        `}
      >
        <Stack
          align="center"
          justify="center"
          css={`
            background: url(${bg});
            background-size: cover;
            height: 316px;
          `}
        >
          {enabled ? (
            <Wrapper>
              <Input
                placeholder="Search documentation"
                id="algolia-doc-search"
                css={`
                  border-radius: 50px;
                  font-size: 23px;
                  lin-height: 56px;
                  outline: none; /* removes the default square outline */

                  :focus {
                    box-shadow: inset 0 0 3px 2px #0971f1;
                  }
                `}
              />
            </Wrapper>
          ) : null}
        </Stack>
        <Element
          marginTop={10}
          css={`
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-gap: 40px;
            font-size: 10px;

            @media screen and (max-width: 768px) {
              grid-template-columns: 1fr;
            }
          `}
        >
          <GridItem>
            <Link
              to="/docs/"
              css={`
                color: inherit;
                text-decoration: none;
              `}
            >
              <IconWrapper bg="#0971F1">
                <svg width={93} height={76} fill="none">
                  <path
                    d="M43.428 76V11.501C43.428-5.699 0 .751 0 3.44V65.25c33.21 0 27.466 6.552 43.428 10.75z"
                    fill="#fff"
                  />
                  <path
                    d="M48.857 76V11.501c0-17.2 43.429-10.75 43.429-8.062V65.25c-33.21 0-27.467 6.552-43.429 10.75z"
                    fill="#fff"
                    fillOpacity={0.4}
                  />
                </svg>
              </IconWrapper>
              <Element padding={4}>
                <Text block weight="bold" size={5}>
                  Documentation
                </Text>
                <Text variant="muted" size={3}>
                  CodeSandbox Documentation
                </Text>
              </Element>
            </Link>
          </GridItem>
          <GridItem>
            <Link
              to="/docs/api"
              css={`
                color: inherit;
                text-decoration: none;
              `}
            >
              <IconWrapper bg="#535bcf">
                <svg width={116} height={76} fill="none">
                  <path
                    d="M37.9 0L0 38l37.9 38 9.475-9.5L18.95 38 47.375 9.5 37.9 0z"
                    fill="#fff"
                    fillOpacity={0.8}
                  />
                  <path
                    d="M77.475 76l37.9-38-37.9-38L68 9.5 96.425 38 68 66.5l9.475 9.5z"
                    fill="#fff"
                    fillOpacity={0.4}
                  />
                </svg>
              </IconWrapper>
              <Element padding={4}>
                <Text block weight="bold" size={5}>
                  API Reference
                </Text>
                <Text variant="muted" size={3}>
                  CodeSandbox API Documentation
                </Text>
              </Element>
            </Link>
          </GridItem>
        </Element>
        <Element marginTop={132}>
          <Text align="center" block weight="bold" marginBottom={56} size={40}>
            Frequently Asked Questions
          </Text>
          <Element dangerouslySetInnerHTML={{ __html: faq }} css={FAQStyle} />
        </Element>
      </Element>
      <Global />
    </Layout>
  );
};

export const query = graphql`
  {
    faq: markdownRemark(fields: { slug: { eq: "/faqs" } }) {
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

export default Docs;
