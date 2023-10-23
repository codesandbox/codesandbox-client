import { EmptyPage } from 'app/pages/Dashboard/Components/EmptyPage';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import React from 'react';
import { useAppState } from 'app/overmind';
import { RecentHeader } from './RecentHeader';
import { DocumentationRow } from './DocumentationRow';
import { InstructionsRow } from './InstructionsRow';
import { OpenSourceRow } from './OpenSourceRow';

export const EmptyRecent: React.FC = () => {
  const { environment } = useAppState();

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
      {!environment.isOnPrem && <InstructionsRow />}
      <TemplatesRow />
      {!environment.isOnPrem && <DocumentationRow />}
      {!environment.isOnPrem && <OpenSourceRow />}
    </EmptyPage.StyledWrapper>
  );
};
