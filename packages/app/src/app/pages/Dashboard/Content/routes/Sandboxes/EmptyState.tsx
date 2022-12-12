import {
  CreateCard,
  Element,
  SkeletonText,
  Stack,
  Text,
} from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import track from '@codesandbox/common/lib/utils/analytics';
import {
  GRID_MAX_WIDTH,
  GUTTER,
} from 'app/pages/Dashboard/Components/VariableGrid';
import { useWorkspaceAuthorization } from 'app/hooks/useWorkspaceAuthorization';
import React from 'react';
import styled from 'styled-components';
import { useOfficialTemplates } from 'app/components/CreateSandbox/useOfficialTemplates';
import { TemplateCard } from 'app/components/CreateSandbox/TemplateCard';
import { useWorkspaceLimits } from 'app/hooks/useWorkspaceLimits';
import { TemplateFragment } from 'app/graphql/types';
import { useActions, useAppState } from 'app/overmind';

const StyledEmptyDescription = styled(Text)`
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  color: #999999;
`;

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

    actions.modals.newSandboxModal.close();
  };

  return (
    <Stack
      css={{
        width: `calc(100% - ${2 * GUTTER}px)`,
        maxWidth: GRID_MAX_WIDTH - 2 * GUTTER,
        margin: '24px auto 0',
      }}
      direction="vertical"
      gap={10}
    >
      {isPersonalSpace ? (
        <StyledEmptyDescription
          as="p"
          dangerouslySetInnerHTML={{ __html: DESCRIPTIONS.PERSONAL }}
        />
      ) : (
        <Stack
          css={{
            width: '100%',
            '@media screen and (min-width: 768px)': {
              width: '560px',
            },
          }}
          direction="vertical"
          gap={6}
        >
          <StyledEmptyDescription
            as="p"
            dangerouslySetInnerHTML={{ __html: DESCRIPTIONS.TEAM }}
          />
        </Stack>
      )}
      <Stack direction="vertical" gap={6}>
        <Text as="h2" margin={0} lineHeight="25px" size={16} weight="normal">
          Start from a template
        </Text>
        <Element
          as="ul"
          css={{
            margin: 0,
            padding: 0,
            position: 'relative',
            overflow: 'hidden',
            display: 'grid',
            listStyle: 'none',
            gap: '16px',
            gridTemplateColumns: 'repeat(auto-fill, minmax(268px, 1fr))',
            gridAutoRows: 'minmax(156px, 1fr)',
          }}
        >
          {officialTemplates.state === 'loading' &&
            new Array(4).fill(undefined).map((_, i) => (
              <SkeletonText
                // eslint-disable-next-line react/no-array-index-key
                key={`templates-skeleton-${i}`}
                css={{
                  width: '100%',
                  height: '100%',
                }}
              />
            ))}
          {officialTemplates.state === 'ready' &&
            officialTemplates.templates.length > 0 &&
            officialTemplates.templates
              .filter(t => TEMPLATE_IDS.includes(t.sandbox.id))
              .map(template => (
                <Stack as="li" key={template.id}>
                  <TemplateCard
                    key={template.id}
                    disabled={hasMaxPublicSandboxes}
                    template={template}
                    onOpenTemplate={handleOpenTemplate}
                    onSelectTemplate={handleSelectTemplate}
                  />
                </Stack>
              ))}

          {((officialTemplates.state === 'ready' &&
            officialTemplates.templates.length === 0) ||
            officialTemplates.state === 'error') && (
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
          )}
        </Element>
      </Stack>
    </Stack>
  );
};
