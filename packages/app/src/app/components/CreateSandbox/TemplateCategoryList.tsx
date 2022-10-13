import React, { useEffect } from 'react';
import track from '@codesandbox/common/lib/utils/analytics';
import { Button, Text, Stack } from '@codesandbox/components';
import { css } from '@styled-system/css';
import { useAppState, useActions } from 'app/overmind';
import { TemplateFragment } from 'app/graphql/types';
import { TemplateCard } from './TemplateCard';
import { TemplateGrid } from './elements';

interface TemplateCategoryListProps {
  title: string;
  isCloudTemplateList?: boolean;
  templates: TemplateFragment[];
  onSelectTemplate: (template: TemplateFragment) => void;
  onOpenTemplate: (template: TemplateFragment) => void;
}

export const TemplateCategoryList = ({
  title,
  isCloudTemplateList,
  templates,
  onSelectTemplate,
  onOpenTemplate,
}: TemplateCategoryListProps) => {
  const { hasLogIn } = useAppState();
  const actions = useActions();

  useEffect(() => {
    track('Create Sandbox Tab Open', { tab: title });
  }, [title]);

  return (
    <Stack direction="vertical" css={{ height: '100%' }} gap={4}>
      <Stack
        css={css({
          alignItems: 'center',
          '@media screen and (max-width: 950px)': {
            display: 'none',
          },
        })}
        gap={2}
      >
        <Text
          as="h2"
          size={4}
          css={{
            fontWeight: 500,
            lineHeight: '24px',
            margin: 0,
          }}
        >
          {title}
        </Text>
      </Stack>
      {!hasLogIn && isCloudTemplateList ? (
        <Stack direction="vertical" gap={4}>
          <Text id="unauthenticated-label" css={{ color: '#999999' }} size={3}>
            You need to be signed in to fork a cloud template.
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
      <TemplateGrid>
        {templates.length > 0 ? (
          templates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelectTemplate={onSelectTemplate}
              onOpenTemplate={onOpenTemplate}
            />
          ))
        ) : (
          <div>No templates for this category.</div>
        )}
      </TemplateGrid>
    </Stack>
  );
};
