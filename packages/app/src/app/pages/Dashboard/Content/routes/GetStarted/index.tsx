import React from 'react';
import { Helmet } from 'react-helmet';
import { StyledContentWrapper } from 'app/pages/Dashboard/Components/shared/elements';
import { Element } from '@codesandbox/components';
import { useActiveTeamInfo } from 'app/hooks/useActiveTeamInfo';
import { InstructionsRow } from './InstructionsRow';
import { DocumentationRow } from './DocumentationRow';
import { SDKRow } from './SDKRow';

export const GetStarted = () => {
  const { sdkWorkspace } = useActiveTeamInfo();

  return (
    <StyledContentWrapper>
      <Helmet>
        <title>Get started - CodeSandbox</title>
      </Helmet>

      {sdkWorkspace ? (
        <Element css={{ paddingTop: '8px' }}>
          <SDKRow />
        </Element>
      ) : (
        <>
          <Element css={{ paddingTop: '8px' }}>
            <InstructionsRow />
          </Element>
          <DocumentationRow />
        </>
      )}
    </StyledContentWrapper>
  );
};
