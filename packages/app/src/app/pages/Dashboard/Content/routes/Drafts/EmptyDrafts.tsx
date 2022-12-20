import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { EmptyPage } from '../../../Components/EmptyPage';

const DESCRIPTIONS = {
  TEAM:
    'By default, every sandbox you create will show up on this folder.<br />Sandboxes in My Drafts are not visible to your team members unless moved to the "All sandboxes" section.',
  PERSONAL:
    'By default, every sandbox you create will show up on this folder.<br />Find all your work in progress easily before moving these sandboxes to a dedicated folder.',
};

export const EmptyDrafts: React.FC = () => {
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper>
      <EmptyPage.StyledDescription
        as="p"
        dangerouslySetInnerHTML={{
          __html: isPersonalSpace ? DESCRIPTIONS.PERSONAL : DESCRIPTIONS.TEAM,
        }}
      />
      <TemplatesRow page="drafts" />
    </EmptyPage.StyledWrapper>
  );
};
