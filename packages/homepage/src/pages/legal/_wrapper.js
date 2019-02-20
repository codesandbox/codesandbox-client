import React from 'react';
import Navigation from './_navigation';
import Layout from '../../components/layout';
import TitleAndMetaTags from '../../components/TitleAndMetaTags';
import PageContainer from '../../components/PageContainer';

export default ({ children }) => (
  <Layout>
    <TitleAndMetaTags title="CodeSandbox - Privacy Policy" />
    <PageContainer width={1024}>
      <Navigation />
      {children}
    </PageContainer>
  </Layout>
);
