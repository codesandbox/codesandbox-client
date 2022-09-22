import React from 'react';
import { Stack, Element } from '@codesandbox/components';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

import { TemplateFragment } from 'app/graphql/types';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { TemplateButton } from './elements';

interface TemplateCardProps {
  template: TemplateFragment;
  onSelectTemplate: (template: TemplateFragment) => void;
}

export const TemplateCard = ({
  template,
  onSelectTemplate,
}: TemplateCardProps) => {
  const { UserIcon } = getTemplateIcon(
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const sandboxTitle = template.sandbox?.title;
  const teamName = template.sandbox?.collection?.team?.name;

  return (
    <TemplateButton type="button" onClick={() => onSelectTemplate(template)}>
      <Stack direction="vertical" gap={4}>
        <UserIcon />
        <Stack direction="vertical" gap={1}>
          <Element as="span" css={{ textOverflow: 'ellipsis ' }}>
            {sandboxTitle}
          </Element>
          {teamName ? (
            <span>
              <VisuallyHidden>by </VisuallyHidden>
              {teamName}
            </span>
          ) : null}
        </Stack>
      </Stack>
    </TemplateButton>
  );
};
