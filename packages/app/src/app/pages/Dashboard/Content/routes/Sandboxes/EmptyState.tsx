import { CreateCard, SkeletonText, Stack } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import { useOfficialTemplates } from 'app/components/CreateSandbox/useOfficialTemplates';
import { TemplateCard } from 'app/components/CreateSandbox/TemplateCard';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TemplateFragment } from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';
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
  const { hasMaxPublicSandboxes } = useWorkspaceLimits();
  const officialTemplates = useOfficialTemplates();
  const actions = useActions();
  const { dashboard } = useAppState();

  const filteredTemplates = React.useMemo(() => {
    return officialTemplates.state === 'ready'
      ? officialTemplates.templates.filter(t =>
          TEMPLATE_IDS.includes(t.sandbox.id)
        )
      : undefined;
  }, [officialTemplates]);

  const handleOpenTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;

    const url = sandboxUrl(sandbox);
    track('Sandboxes - open template from empty state', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    window.open(url, '_blank');
  };

  const handleSelectTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const collection = dashboard.allCollections?.find(c => c.path === '/');

    track('Sandboxes - select template from empty state', {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false,
      body: {
        collectionId: collection?.id,
      },
    });
  };

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
      <Stack direction="vertical" gap={6}>
        <EmptyPage.StyledGridTitle as="h2">
          Start from a template
        </EmptyPage.StyledGridTitle>
        <EmptyPage.StyledGrid as="ul">
          {officialTemplates.state === 'loading'
            ? new Array(4).fill(undefined).map((_, i) => (
                <SkeletonText
                  // eslint-disable-next-line react/no-array-index-key
                  key={`templates-skeleton-${i}`}
                  as="li"
                  css={{
                    width: '100%',
                    height: '100%',
                  }}
                />
              ))
            : null}
          {filteredTemplates && filteredTemplates.length > 0
            ? filteredTemplates.map(template => (
                <Stack as="li" key={template.id}>
                  <TemplateCard
                    key={template.id}
                    disabled={hasMaxPublicSandboxes}
                    template={template}
                    onOpenTemplate={handleOpenTemplate}
                    onSelectTemplate={handleSelectTemplate}
                  />
                </Stack>
              ))
            : null}

          {filteredTemplates?.length === 0 ||
          officialTemplates.state === 'error' ? (
            <CreateCard
              icon="plus"
              label="New from a template"
              onClick={() => {
                track('Sandboxes - open import modal from empty state', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
                actions.openCreateSandboxModal();
              }}
            />
          ) : null}
        </EmptyPage.StyledGrid>
      </Stack>
    </EmptyPage.StyledWrapper>
  );
};
