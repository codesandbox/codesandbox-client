import { getTemplateIcon as commonTemplateIcon } from '@codesandbox/common/lib/utils/getTemplateIcon';

export const getTemplateIcon = (sandbox: {
  title?: string;
  forkedTemplate?: { iconUrl: string };
  customTemplate?: { iconUrl: string };
  source: { template: string };
}) => {
  if (!sandbox) return () => null;

  // If the sandbox is a template, use that icon. Otherwise, use the icon
  // of the forked template.
  const template = sandbox.customTemplate || sandbox.forkedTemplate;

  const { UserIcon } = commonTemplateIcon(
    sandbox.title,
    template?.iconUrl,
    sandbox.source.template
  );

  return UserIcon;
};
