import React from 'react';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default ({ children }) => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Privacy Policy" />
    <PageContainer width={1024}>{children}</PageContainer>
  </Layout>
);
