import { Sandbox } from '@codesandbox/common/lib/types';
import getDefinition from '@codesandbox/common/lib/templates';
import { resolveModuleWrapped } from './resolve-module-wrapped';

function getOpenFile(sandboxConfigJson: string): string | null {
  try {
    const { openFile } = JSON.parse(sandboxConfigJson);
    if (openFile) {
      return openFile[0] === '/' ? openFile : '/' + openFile;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

export function mainModule(sandbox: Sandbox, parsedConfigurations: any) {
  const templateDefinition = getDefinition(sandbox.template);

  const resolve = resolveModuleWrapped(sandbox);

  const module = templateDefinition
    .getEntries(parsedConfigurations)
    .map(p => resolve(p))
    .find(m => Boolean(m));

  return module || sandbox.modules[0];
}

export function defaultOpenedModule(
  sandbox: Sandbox,
  parsedConfigurations: any
) {
  const templateDefinition = getDefinition(sandbox.template);

  const resolve = resolveModuleWrapped(sandbox);

  const files = templateDefinition.getDefaultOpenedFiles(parsedConfigurations);
  if (parsedConfigurations.sandbox) {
    const openFile = getOpenFile(parsedConfigurations.sandbox.code);
    console.warn('openFile:', openFile);
    if (openFile) {
      files.unshift(openFile);
    }
  }
  const module = files.map(p => resolve(p)).find(m => Boolean(m));

  return module || sandbox.modules[0];
}
