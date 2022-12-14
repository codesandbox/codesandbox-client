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
    'Sandboxes are a great way to prototype your ideas with zero startup costs and with everything you need: a code editor, previews, dev servers, unit tests, Storybook and many other devtools.<br /><br />Sandboxes in this folder are visible to all team members.',
  PERSONAL:
    'Sandboxes are a great way to prototype your ideas with zero startup costs and with everything you need: a code editor, previews, dev servers, unit tests, Storybook and many other devtools.',
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
        page={'sandboxes' as const}
        title="Start from a template"
        templateIds={TEMPLATE_IDS}
      />
    </EmptyPage.StyledWrapper>
  );
};
