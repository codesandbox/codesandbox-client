import { getTemplateIcon as commonTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

export const getTemplateIcon = sandbox => {
  if (!sandbox) return () => null;

  const { UserIcon } = commonTemplateIcon(
    sandbox.title,
    sandbox.forkedTemplate?.iconUrl,
    sandbox.source?.template
  );

  return UserIcon;
};
