import React from 'react';
import { graphql, Link } from 'gatsby';
import { Element, Text } from '@codesandbox/components';
import Layout from '../../components/new-layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { useAccordion } from '../../utils/useAccordion';
import { FAQStyle } from './_global';

const FAQS = ({ data }) => {
  const faq = data.faq.html;
  useAccordion();

  return (
    <Layout noWrapperStyling docs>
      <TitleAndMetaTags description="CodeSandbox FAQ" title="CodeSandbox FAQ" />
      <Element
        paddingTop={132}
        css={`
          width: 1086px;
          margin: auto;
          max-width: 80%;
        `}
      >
        <Text align="center" block weight="bold" marginBottom={56} size={40}>
          Frequently Asked Questions
        </Text>
        <Element dangerouslySetInnerHTML={{ __html: faq }} css={FAQStyle} />
        <Element marginTop={173} paddingBottom={14}>
          <Text weight="bold" align="center" bold size={6} block>
            Still haven't found what you are looking for?
          </Text>
          <Text
            align="center"
            bold
            marginTop={6}
            block
            variant="muted"
            css={`
              a {
                color: inherit;
              }
            `}
          >
            Have a look at our <Link to="/docs">Documentation</Link>,{' '}
            <a href="mailto:support@codesandbox.io">
              Contact Developer Support
            </a>{' '}
            or open an issue{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/codesandbox/codesandbox-client"
            >
              here
            </a>
            .
          </Text>
        </Element>
      </Element>
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

export default FAQS;
