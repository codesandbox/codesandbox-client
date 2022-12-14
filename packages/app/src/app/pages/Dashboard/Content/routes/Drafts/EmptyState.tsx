import { Stack } from '@codesandbox/components';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { TemplatesRow } from 'app/pages/Dashboard/Components/TemplatesRow';
import { EmptyPage } from '../../../Components/EmptyPage';

const TEMPLATE_IDS = [
  'k8dsq1', // NodeJS (cloud)
  'vanilla', // Vanilla JS (browser)
  'uo1h0', // NextJS (cloud)
  '9qputt', // React + Vite (browser)
];

const DESCRIPTIONS = {
  TEAM:
    'By default, every sandbox you create will show up on this folder.<br />Sandboxes in My Drafts are not visible to your team members unless moved to the "All sandboxes" section.',
  PERSONAL:
    'By default, every sandbox you create will show up on this folder.<br />Find all your work in progress easily before moving these sandboxes to a dedicated folder.',
};

export const EmptyState: React.FC = () => {
  const { isPersonalSpace } = useWorkspaceAuthorization();

  return (
    <EmptyPage.StyledWrapper>
      <Stack
        css={{
          width: '100%',

          '@media screen and (min-width: 768px)': {
            width: isPersonalSpace ? '100%' : '560px',
          },
        }}
      >
        <EmptyPage.StyledDescription
          as="p"
          dangerouslySetInnerHTML={{
            __html: isPersonalSpace ? DESCRIPTIONS.PERSONAL : DESCRIPTIONS.TEAM,
          }}
        />
      </Stack>
      <TemplatesRow
        page="drafts"
        title="Start from a template"
        templateIds={TEMPLATE_IDS}
      />
    </EmptyPage.StyledWrapper>
  );
};
