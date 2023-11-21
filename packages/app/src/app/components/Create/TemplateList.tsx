import React from 'react';
import { Button, Text, Stack } from '@codesandbox/components';
import { useAppState, useActions } from 'app/overmind';
import { TemplateFragment } from 'app/graphql/types';
import track from '@codesandbox/common/lib/utils/analytics';
import { TemplateCard } from './TemplateCard';
import {
  DevboxAlternative,
  SandboxAlternative,
  TemplateGrid,
} from './elements';

interface TemplateListProps {
  title: string;
  showEmptyState?: boolean;
  searchQuery?: string;
  type: 'sandbox' | 'devbox';
  templates: TemplateFragment[];
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
}

export const TemplateList = ({
  title,
  templates,
  onSelectTemplate,
  onOpenTemplate,
  showEmptyState = false,
  searchQuery,
  type,
}: TemplateListProps) => {
  const { hasLogIn } = useAppState();
  const actions = useActions();

  const requireLogin = !hasLogIn && type === 'devbox';

  return (
    <Stack direction="vertical" css={{ height: '100%' }} gap={4}>
      <Stack align="center" gap={2}>
        <Text
          as="h2"
          size={4}
          css={{
            fontWeight: 500,
            lineHeight: '24px',
            margin: 0,
          }}
        >
          {showEmptyState && templates.length === 0 ? 'No results' : title}
        </Text>
      </Stack>

      {requireLogin ? (
        <Stack direction="vertical" gap={4}>
          <Text id="unauthenticated-label" css={{ color: '#999999' }} size={3}>
            You need to be signed in to fork a devbox template.
          </Text>
          <Button
            aria-describedby="unauthenticated-label"
            css={{
              width: '132px',
            }}
            onClick={() => actions.signInClicked()}
            variant="primary"
          >
            Sign in
          </Button>
        </Stack>
      ) : null}

      {templates.length > 0 && (
        <TemplateGrid>
          {templates.map(template => (
            <TemplateCard
              key={template.id}
              disabled={requireLogin}
              template={template}
              onSelectTemplate={onSelectTemplate}
              onOpenTemplate={onOpenTemplate}
            />
          ))}
        </TemplateGrid>
      )}

      {showEmptyState && searchQuery && templates.length === 0 && (
        <Stack
          direction="vertical"
          align="center"
          gap={2}
          css={{ width: '100%', padding: '24px', background: '#2a2a2a' }}
        >
          <Text size={4} weight="600">
            Not finding what you need?
          </Text>
          <Text size={3} css={{ width: '300px', textAlign: 'center' }}>
            {type === 'devbox' ? (
              <DevboxAlternative
                searchQuery={searchQuery}
                onClick={() => {
                  track(`Create ${type} - Open Community Search`, {
                    codesandbox: 'V1',
                    event_source: 'UI - Empty Template List',
                  });
                }}
              />
            ) : (
              <SandboxAlternative
                onClick={() => {
                  track(`Create ${type} - Open Devboxes`, {
                    codesandbox: 'V1',
                    event_source: 'UI - Empty Template List',
                  });
                  actions.modalOpened({
                    modal: 'createDevbox',
                  });
                }}
              />
            )}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
