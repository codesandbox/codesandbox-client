import React from 'react';
import Layout from '../components/layout';
import PageContainer from '../components/PageContainer';
import TitleAndMetaTags from '../components/TitleAndMetaTags';
import Sadbox from '../components/Sadbox';

import { Title, TitleWrapper } from './embeds/_elements';
import Button from '../components/Button';

export default () => (
  <Layout>
    <TitleAndMetaTags
      title={`${' Embed CodeSandbox in Docs, Blog Posts, and Websites'} - CodeSandbox`}
    />
    <PageContainer width={1086}>
      <TitleWrapper>
        <Title> Oh no, you seem to be lost</Title>
      </TitleWrapper>

      <div
        css={`
          display: flex;
          justify-content: center;
          margin: 3rem 0;
        `}
      >
        <Sadbox />
      </div>
      <div
        css={`
          display: flex;
          justify-content: center;
          margin-bottom: 3rem;
        `}
      >
        <Button big href="/s">
          Create a Sandbox
        </Button>
      </div>
    </PageContainer>
  </Layout>
);
