import React from 'react';
import { Helmet } from 'react-helmet';
import { ThemeProvider, Element } from '@codesandbox/components';
import { Navigation } from 'app/pages/common/Navigation';

import { WorkspacePlanSelection } from './legacy-pages/WorkspacePlanSelection';

export const ProLegacy: React.FC = () => {
  return (
    <ThemeProvider>
      <Helmet>
        <title>Pro - CodeSandbox</title>
      </Helmet>
      <Element
        css={{
          backgroundColor: '#0E0E0E',
          color: '#E5E5E5',
          width: '100%',
          maxWidth: '100vw',
          overflowX: 'hidden',
          minHeight: '100vh',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <Navigation showActions={false} />

        <Element css={{ height: '48px' }} />

        <WorkspacePlanSelection />
      </Element>
    </ThemeProvider>
  );
};
