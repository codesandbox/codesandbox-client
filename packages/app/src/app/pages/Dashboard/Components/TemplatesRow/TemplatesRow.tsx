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
import { PageTypes } from '../../types';

const TEMPLATE_IDS = [
  'k8dsq1', // NodeJS (cloud)
  'vanilla', // Vanilla JS (browser)
  'uo1h0', // NextJS (cloud)
  '9qputt', // React + Vite (browser)
];

const MAP_PAGE_TYPE_TO_NAME: Record<PageTypes, string> = {
  search: 'Search',
  recent: 'Recent',
  deleted: 'Deleted',
  templates: 'Templates',
  drafts: 'Drafts',
  sandboxes: 'Sandboxes',
  'synced-sandboxes': 'Synced sandboxes',
  'my-contributions': 'Contribution branches',
  repositories: 'Repositories',
  shared: 'Shared sandboxes',
  liked: 'Liked sandboxes',
  discover: 'Discovery',
  external: 'External',
};

type TemplatesRowProps = {
  page: PageTypes;
  title?: string;
};
export const TemplatesRow: React.FC<TemplatesRowProps> = ({ title, page }) => {
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

  const handleOpenTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox);

    track(`${MAP_PAGE_TYPE_TO_NAME[page]} - open template from empty state`, {
      codesandbox: 'V1',
      event_source: 'UI',
    });

    window.open(url, '_blank');
  };

  const handleSelectTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const collection = dashboard.allCollections?.find(c => c.path === '/');

    track(`${MAP_PAGE_TYPE_TO_NAME[page]} - fork template from empty state`, {
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
    <Stack direction="vertical" gap={6}>
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
              track(
                `${MAP_PAGE_TYPE_TO_NAME[page]} - open import modal from empty state`,
                {
                  codesandbox: 'V1',
                  event_source: 'UI',
                }
              );
              actions.openCreateSandboxModal();
            }}
          />
        ) : null}
      </EmptyPage.StyledGrid>
    </Stack>
  );
};
