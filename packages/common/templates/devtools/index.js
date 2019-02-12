import getTemplateDefinition from '../';
import { resolveModule } from '../../sandbox/modules';

export const getPreviewTabs = sandbox => {
  const template = getTemplateDefinition(sandbox.template);

  let views = template.getViews();

  try {
    const workspaceConfig = resolveModule(
      '/.codesandbox/workspace.json',
      sandbox.modules,
      sandbox.directories
    );

    const { preview } = JSON.parse(workspaceConfig.code);

    if (preview && Array.isArray(preview)) {
      views = preview;
    }
  } catch (e) {
    /* */
  }

  return views;
};
