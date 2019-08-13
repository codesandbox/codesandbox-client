import { dirname } from 'path';
import immer from 'immer';
import { generateFileFromSandbox } from '@codesandbox/common/lib/templates/configuration/package-json';
import getTemplate from '@codesandbox/common/lib/templates';
import { getPreviewTabs } from '@codesandbox/common/lib/templates/devtools';
import { getSandboxOptions } from '@codesandbox/common/lib/url';
import {
  getModulePath,
  getDirectoryPath,
} from '@codesandbox/common/lib/sandbox/modules';
import { parseConfigurations } from '../../utils/parse-configurations';
import { mainModule as getMainModule } from '../../utils/main-module';

export function currentSandbox() {
  return this.sandboxes.get(this.currentId);
}

export function isAllModulesSynced() {
  return !this.changedModuleShortids.length;
}

export function currentModule() {
  return (
    this.currentSandbox.modules.find(
      module => module.shortid === this.currentModuleShortid
    ) || {}
  );
}

export function modulesByPath() {
  const modulesObject = {};

  if (!this.currentSandbox) {
    return modulesObject;
  }

  this.currentSandbox.modules.forEach(m => {
    const path = getModulePath(
      this.currentSandbox.modules,
      this.currentSandbox.directories,
      m.id
    );
    if (path) {
      modulesObject[path] = { ...m, type: 'file' };
    }
  });

  this.currentSandbox.directories.forEach(d => {
    const path = getDirectoryPath(
      this.currentSandbox.modules,
      this.currentSandbox.directories,
      d.id
    );

    // If this is a single directory with no children
    if (!Object.keys(modulesObject).some(p => dirname(p) === path)) {
      modulesObject[path] = { ...d, type: 'directory' };
    }
  });

  return modulesObject;
}

export function currentTab() {
  const currentTabId = this.currentTabId;
  const tabs = this.tabs;
  const currentModuleShortid = this.currentModuleShortid;

  if (currentTabId) {
    const foundTab = this.tabs.find(tab => tab.id === currentTabId);

    if (foundTab) {
      return foundTab;
    }
  }

  return tabs.find(tab => tab.moduleShortid === currentModuleShortid);
}

/**
 * We have two types of editors in CodeSandbox: an editor focused on smaller projects and
 * an editor that works with bigger projects that run on a container. The advanced editor
 * only has added features, so it's a subset on top of the existing editor.
 */
export function isAdvancedEditor() {
  if (!this.currentSandbox) {
    return false;
  }

  const isServer = getTemplate(this.currentSandbox.template).isServer;

  return isServer && this.currentSandbox.owned;
}

export function parsedConfigurations() {
  return parseConfigurations(this.currentSandbox);
}

export function mainModule() {
  return getMainModule(this.currentSandbox, this.parsedConfigurations);
}

export function currentPackageJSON() {
  const module = this.currentSandbox.modules.find(
    m => m.directoryShortid == null && m.title === 'package.json'
  );

  return module;
}

export function currentPackageJSONCode() {
  return this.currentPackageJSON
    ? this.currentPackageJSON.code
    : generateFileFromSandbox(this.currentSandbox);
}

export function devToolTabs() {
  const sandbox = this.currentSandbox;
  const intermediatePreviewCode = this.workspaceConfigCode;
  const views = getPreviewTabs(sandbox, intermediatePreviewCode);

  // Do it in an immutable manner, prevents changing the original object
  return immer(views, draft => {
    const sandboxConfig = sandbox.modules.find(
      x => x.directoryShortid == null && x.title === 'sandbox.config.json'
    );
    let view = 'browser';
    if (sandboxConfig) {
      try {
        view = JSON.parse(sandboxConfig.code || '').view || 'browser';
      } catch (e) {
        /* swallow */
      }
    }

    const sandboxOptions = getSandboxOptions(location.href);
    if (
      sandboxOptions.previewWindow &&
      (sandboxOptions.previewWindow === 'tests' ||
        sandboxOptions.previewWindow === 'console')
    ) {
      // Backwards compatibility for ?previewwindow=

      view = sandboxOptions.previewWindow;
    }

    if (view !== 'browser') {
      // Backwards compatibility for sandbox.config.json
      if (view === 'console') {
        draft[0].views = draft[0].views.filter(
          t => t.id !== 'codesandbox.console'
        );
        draft[0].views.unshift({ id: 'codesandbox.console' });
      } else if (view === 'tests') {
        draft[0].views = draft[0].views.filter(
          t => t.id !== 'codesandbox.tests'
        );
        draft[0].views.unshift({ id: 'codesandbox.tests' });
      }
    }
  });
}
