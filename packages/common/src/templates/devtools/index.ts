import getTemplateDefinition from '..';
import { resolveModule } from '../../sandbox/modules';
import { ViewConfig, ParsedConfigurationFiles } from '../template';
import { Sandbox } from '../../types';

export const getPreviewTabs = (
  sandbox: Sandbox,
  configurations: ParsedConfigurationFiles,
  intermediatePreviewCode = ''
) => {
  const template = getTemplateDefinition(sandbox.template);

  let views = template.getViews(configurations);

  try {
    const workspaceConfig = intermediatePreviewCode
      ? { code: intermediatePreviewCode }
      : resolveModule(
          '/.codesandbox/workspace.json',
          sandbox.modules,
          sandbox.directories
        );

    const { preview } = JSON.parse(workspaceConfig.code) as {
      preview: ViewConfig[];
    };

    if (preview && Array.isArray(preview)) {
      views = preview;
    }
  } catch (e) {
    /* Ignore */
  }

  return views;
};
