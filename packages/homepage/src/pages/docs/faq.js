import React from 'react';
import { graphql } from 'gatsby';
import { Element, Text } from '@codesandbox/components';
import Layout from '../../components/new-layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import { useAccordion } from '../../utils/useAccordion';
import { FAQStyle } from './_global';

const FAQS = ({ data }) => {
  const faq = data.faq.html;
  useAccordion();

  return (
    <Layout noWrapperStyling>
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
