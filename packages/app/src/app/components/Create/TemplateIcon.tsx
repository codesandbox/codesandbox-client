import React from 'react';
import { getTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';
import { SandboxToFork } from './utils/types';

export const TemplateIcon: React.FC<{ template: SandboxToFork }> = ({
  template,
}) => {
  if (template.iconUrl?.startsWith('https://')) {
    return (
      <img src={template.iconUrl} width={20} height={20} alt={template.title} />
    );
  }

  // Legacy way of handling Icon which I didn't want to tackle with this PR
  const { UserIcon } = getTemplateIcon(
    template.title,
    template.iconUrl,
    template.sourceTemplate
  );

  return <UserIcon height="20" width="20" />;
};
