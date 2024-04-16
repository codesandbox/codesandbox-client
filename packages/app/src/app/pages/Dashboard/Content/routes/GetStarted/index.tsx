import React from 'react';
import { Helmet } from 'react-helmet';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';
import { Element } from '@codesandbox/components';
import { InstructionsRow } from './InstructionsRow';
import { DocumentationRow } from './DocumentationRow';

export const GetStarted = () => {
  return (
    <StyledContentWrapper>
      <Helmet>
        <title>Get started - CodeSandbox</title>
      </Helmet>

      <Element css={{ paddingTop: '8px' }}>
        <InstructionsRow />
      </Element>
      <DocumentationRow />
    </StyledContentWrapper>
  );
};
