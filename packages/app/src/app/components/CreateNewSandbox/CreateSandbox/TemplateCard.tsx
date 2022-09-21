import React from 'react';
import { Stack, Element } from '@codesandbox/components';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

import { TemplateFragment } from 'app/graphql/types';
import { VisuallyHidden } from 'reakit/VisuallyHidden';
import { TemplateButton } from './elements';

export const TemplateCard = ({
  template,
  selectTemplate,
}: {
  template: TemplateFragment;
  selectTemplate: (template: TemplateFragment) => void;
}) => {
  const { UserIcon } = getTemplateIcon(
    template.iconUrl,
    template.sandbox?.source?.template
  );

  const sandboxTitle = template.sandbox?.title;
  const teamName = template.sandbox?.collection?.team?.name;

  return (
    <TemplateButton type="button" onClick={() => selectTemplate(template)}>
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
