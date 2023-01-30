import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import React from 'react';
import { RecentHeader } from './RecentHeader';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';
import { OpenSourceRow } from './OpenSourceRow';

export const EmptyRecent: React.FC = () => {
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper
      css={{
        gap: '48px',
        height: 'auto',
        paddingBottom: '64px',
        marginTop: '28px',
      }}
    >
      <RecentHeader title="Let's start building" />
      <InstructionsRow />
      <TemplatesRow />
      <DocumentationRow />
      <OpenSourceRow />
      {isPersonalSpace ? <OpenSourceRow /> : null}
    </EmptyPage.StyledWrapper>
  );
};
