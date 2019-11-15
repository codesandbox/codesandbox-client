import React from 'react';

import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Join from '../screens/home/join';
import { Title } from '../templates/_feature.elements';
import { P } from '../components/Typography';

export default () => (
  <Layout>
    <TitleAndMetaTags title="Pricing - CodeSandbox" />
    <PageContainer width={1086}>
      <Title textCenter>Pricing</Title>
    </PageContainer>

    <Join />
  </Layout>
);
