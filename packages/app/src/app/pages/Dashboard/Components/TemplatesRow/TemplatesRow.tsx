import React from 'react';
import { CreateCard, SkeletonText, Stack } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOfficialTemplates } from 'app/components/CreateSandbox/useOfficialTemplates';
import { TemplateCard } from 'app/components/CreateSandbox/TemplateCard';
import { useActions, useAppState } from 'app/overmind';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { EmptyPage } from '../EmptyPage';

const TEMPLATE_IDS = [
  'k8dsq1', // NodeJS (cloud)
  'vanilla', // Vanilla JS (browser)
  'fxis37', // NextJS (cloud)
  'hsd8ke', // Docker Starter (cloud)
  '9qputt', // React + Vite (browser)
];

export const TemplatesRow: React.FC = () => {
  const officialTemplates = useOfficialTemplates();
  const actions = useActions();
  const { dashboard } = useAppState();
  const { hasMaxPublicSandboxes } = useWorkspaceLimits();

  const filteredTemplates = React.useMemo(() => {
    return officialTemplates.state === 'ready'
      ? officialTemplates.templates.filter(t =>
          TEMPLATE_IDS.includes(t.sandbox.id)
        )
      : undefined;
  }, [officialTemplates]);

  const handleTemplateTracking = (id: string, action: 'open' | 'fork') => {
    track('Empty State Card - Sandbox template', {
      codesandbox: 'V1',
      event_source: 'UI',
      card_type: `sbx-template-${id}`,
      action,
    });
  };

  const handleOpenTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox);

    handleTemplateTracking(sandbox.id, 'open');

    window.open(url, '_blank');
  };

  const handleSelectTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const collection = dashboard.allCollections?.find(c => c.path === '/');

    handleTemplateTracking(sandbox.id, 'fork');

    actions.editor.forkExternalSandbox({
      sandboxId: sandbox.id,
      openInNewWindow: false,
      body: {
        collectionId: collection?.id,
      },
    });
  };

  return (
    <EmptyPage.StyledGridWrapper>
      <EmptyPage.StyledGridTitle as="h2">
        Start from a template
      </EmptyPage.StyledGridTitle>
      <EmptyPage.StyledGrid as="ul">
        {officialTemplates.state === 'loading'
          ? TEMPLATE_IDS.map(templateId => (
              <SkeletonText
                key={templateId}
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
                  padding={24}
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
            title="New from a template"
            onClick={() => {
              track('Empty State Card - Open create modal', {
                codesandbox: 'V1',
                event_source: 'UI',
                card_type: 'get-started-action',
                tab: 'default',
              });

              actions.openCreateSandboxModal();
            }}
          />
        ) : null}
      </EmptyPage.StyledGrid>
    </EmptyPage.StyledGridWrapper>
  );
};
