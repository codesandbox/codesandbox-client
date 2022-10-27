import React from 'react';
import css from '@styled-system/css';
import { Icon, SkeletonText, Stack, Text } from '@codesandbox/components';
import { sandboxUrl } from '@codesandbox/common/lib/utils/url-generator';
import { useOfficialTemplates } from 'app/components/CreateSandbox/useOfficialTemplates';
import { TemplateCard } from 'app/components/CreateSandbox/TemplateCard';
import { TemplateButton } from 'app/components/CreateSandbox/elements';
import { GitHubIcon } from 'app/components/CreateSandbox/Icons';
import { useActions, useAppState } from 'app/overmind';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { GUTTER } from '../VariableGrid';
import { TemplatesGrid } from './elements';

export const TemplatesRow: React.FC = () => {
  const officialTemplates = useOfficialTemplates();
  const actions = useActions();
  const { dashboard } = useAppState();

  const collection = dashboard.allCollections.find(c => c.path === '/');

  const handleOpenTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;
    const url = sandboxUrl(sandbox);
    window.open(url, '_blank');
  };

  const handleSelectTemplate = (template: TemplateFragment) => {
    const { sandbox } = template;

    track('Recent - open template from empty state', {
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
      as="section"
      css={css({
        width: `calc(100% - ${2 * GUTTER}px)`,
        marginX: 'auto',
      })}
      direction="vertical"
      gap={4}
    >
      <Text
        as="h2"
        css={css({
          margin: 0,
        })}
        weight="400"
        size={4}
      >
        Start from a template or import from Github
      </Text>
      <TemplatesGrid>
        {officialTemplates.state === 'loading' &&
          new Array(5).fill(undefined).map((_, i) => (
            <SkeletonText
              // eslint-disable-next-line react/no-array-index-key
              key={`templates-skeleton-${i}`}
              css={css({
                width: '100%',
                height: '116px',
              })}
            />
          ))}

        {officialTemplates.state === 'ready' && (
          <>
            {officialTemplates.templates
              .slice(0, 3) // TODO: define which templates to show
              .map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onOpenTemplate={handleOpenTemplate}
                  onSelectTemplate={handleSelectTemplate}
                />
              ))}
            <TemplateButton
              onClick={() => {
                track('Recent - import repo from empty state', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
                actions.openCreateSandboxModal({ initialTab: 'import' });
              }}
            >
              <Stack
                css={{
                  height: '100%',
                }}
                direction="vertical"
                gap={4}
              >
                <GitHubIcon size={32} />
                <Stack
                  align="center"
                  css={{
                    flex: 1,
                  }}
                >
                  <Text
                    css={{
                      fontSize: '14px',
                      fontWeight: 500,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Open from GitHub
                  </Text>
                </Stack>
              </Stack>
            </TemplateButton>
            <TemplateButton
              aria-label="Open create sandbox modal"
              onClick={() => {
                track('Recent - open import modal from empty state', {
                  codesandbox: 'V1',
                  event_source: 'UI',
                });
                actions.openCreateSandboxModal();
              }}
            >
              <Stack align="center" justify="center">
                <Icon name="plus" size={32} />
              </Stack>
            </TemplateButton>
          </>
        )}
      </TemplatesGrid>
    </Stack>
  );
};
