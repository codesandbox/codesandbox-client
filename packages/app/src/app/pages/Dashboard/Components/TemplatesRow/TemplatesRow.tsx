import React from 'react';
import css from '@styled-system/css';
import { Icon, SkeletonText, Stack, Text } from '@codesandbox/components';
import { useOfficialTemplates } from 'app/components/CreateSandbox/useOfficialTemplates';
import { TemplateCard } from 'app/components/CreateSandbox/TemplateCard';
import { TemplateButton } from 'app/components/CreateSandbox/elements';
import { GitHubIcon } from 'app/components/CreateSandbox/Icons';
import { GUTTER } from '../VariableGrid';
import { TemplatesGrid } from './elements';

export const TemplatesRow: React.FC = () => {
  const officialTemplates = useOfficialTemplates();

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
        Pick up where you left off
      </Text>
      <TemplatesGrid>
        {officialTemplates.state === 'loading' &&
          new Array(5).fill(undefined).map((_, i) => (
            <SkeletonText
              // eslint-disable-next-line react/no-array-index-key
              key={`templates-skeleton-${i}`}
              css={css({
                width: '100%',
                height: '124px',
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
                  onOpenTemplate={() => alert('open')}
                  onSelectTemplate={() => alert('select')}
                />
              ))}
            <TemplateButton>
              <Stack
                css={{
                  height: '124px',
                }}
                justify="center"
                direction="vertical"
                gap={4}
              >
                <GitHubIcon />
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
            </TemplateButton>
            <TemplateButton>
              <Icon name="plus" size={32} />
            </TemplateButton>
          </>
        )}
      </TemplatesGrid>
    </Stack>
  );
};
