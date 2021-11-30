import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import { Context } from 'app/overmind';
import { isEqual } from 'lodash-es';
import { json } from 'overmind';
import { Presets, defaultPresets } from './state';

export const toggleResponsiveMode = async ({
  state,
  actions,
  effects,
}: Context) => {
  const existingMode = state.preview.mode;
  const newUrl = new URL(document.location.href);

  switch (existingMode) {
    case 'responsive':
      state.preview.mode = null;
      break;
    case 'add-comment':
      state.preview.mode = 'responsive-add-comment';
      break;
    case 'responsive-add-comment':
      state.preview.mode = 'add-comment';
      break;
    default: {
      state.preview.mode = 'responsive';
      effects.analytics.track('Responsive Preview - Toggled On');
    }
  }

  if (state.preview.mode) {
    newUrl.searchParams.set(
      'resolutionWidth',
      state.preview.responsive.resolution[0].toString()
    );
    newUrl.searchParams.set(
      'resolutionHeight',
      state.preview.responsive.resolution[1].toString()
    );

    if (!state.editor.workspaceConfig) {
      actions.files.updateWorkspaceConfig({
        'responsive-preview': defaultPresets,
      });
    }
  } else {
    newUrl.searchParams.delete('resolutionWidth');
    newUrl.searchParams.delete('resolutionHeight');
  }

  if (newUrl) {
    effects.router.replace(
      newUrl.toString().replace(/%2F/g, '/').replace('%3A', ':')
    );
  }
};

export const setResolution = (
  { state, effects }: Context,
  newResolution: [number, number]
) => {
  if (!newResolution) return;
  const width = Math.round(newResolution[0]);
  const height = Math.round(newResolution[1]);

  state.preview.responsive.resolution = [width, height];

  const newUrl = new URL(document.location.href);
  newUrl.searchParams.set('resolutionWidth', width.toString());
  newUrl.searchParams.set('resolutionHeight', height.toString());

  if (newUrl) {
    effects.router.replace(
      newUrl.toString().replace(/%2F/g, '/').replace('%3A', ':')
    );
  }
};

export const openDeletePresetModal = ({ state }: Context) => {
  state.currentModal = 'deletePreset';
};

export const openAddPresetModal = ({ state }: Context) => {
  state.currentModal = 'addPreset';
};

export const toggleEditPresets = ({ state }: Context) => {
  state.currentModal = 'editPresets';
};

export const deletePreset = async ({ state, actions }: Context) => {
  const { presets, resolution } = state.preview.responsive;

  const canChangePresets = hasPermission(
    state.editor.currentSandbox!.authorization,
    'write_code'
  );

  if (!canChangePresets) {
    await actions.editor.forkSandboxClicked({});
  }

  const activePresetName = Object.keys(presets).find(preset =>
    isEqual(presets[preset], resolution)
  );

  if (activePresetName) {
    state.preview.responsive.resolution = json(Object.values(presets)[0]);

    const responsivePreviewConfig = state.editor.workspaceConfig
      ? state.editor.workspaceConfig['responsive-preview']
      : defaultPresets;
    const presetsCopy = json(responsivePreviewConfig || {});
    delete presetsCopy[activePresetName.toString()];

    await actions.files.updateWorkspaceConfig({
      'responsive-preview': presetsCopy,
    });
  }
};

export const addPreset = async (
  { state, actions, effects }: Context,
  {
    name,
    width,
    height,
  }: {
    name: string;
    width: number;
    height: number;
  }
) => {
  if (!name || !width || !height) return;
  effects.analytics.track('Responsive Preview - Preset Created', {
    width,
    height,
  });
  state.preview.responsive.resolution = [width, height];

  const canChangePresets = hasPermission(
    state.editor.currentSandbox!.authorization,
    'write_code'
  );

  if (!canChangePresets) {
    await actions.editor.forkSandboxClicked({});
  }

  const responsivePreviewConfig = state.editor.workspaceConfig
    ? state.editor.workspaceConfig['responsive-preview']
    : defaultPresets;
  const presetsCopy = json(responsivePreviewConfig || {});
  presetsCopy[name] = [width, height];

  await actions.files.updateWorkspaceConfig({
    'responsive-preview': presetsCopy,
  });
};

export const editPresets = async (
  { actions }: Context,
  newPresets: Presets
) => {
  await actions.files.updateWorkspaceConfig({
    'responsive-preview': newPresets,
  });
};

export const setExtension = ({ state }: Context, hasExtension: boolean) => {
  state.preview.hasExtension = hasExtension;
};

export const closeExtensionBanner = ({ state }: Context) => {
  state.preview.showExtensionBanner = false;
};

export const installExtension = async ({
  actions,
  state,
  effects,
}: Context) => {
  await effects.browserExtension.install();

  const doReload = await actions.modals.extensionInstalledModal.open();

  if (doReload) {
    effects.browser.reload();
  }

  state.preview.showExtensionBanner = false;
};

export const createPreviewComment = async ({ state, effects }: Context) => {
  const currentSandbox = state.editor.currentSandbox;

  if (!currentSandbox || !effects.preview.canAddComments(currentSandbox)) {
    return;
  }

  const existingMode = state.preview.mode;

  state.preview.screenshot.source = null;

  const takeScreenshot = async () => {
    try {
      if (state.preview.hasExtension) {
        effects.preview.showCommentCursor();
        const screenshot = await effects.preview.takeExtensionScreenshot();
        state.preview.screenshot.source = screenshot;
      } else {
        state.preview.screenshot.isLoading = true;

        const screenshot = await effects.preview.takeScreenshot(
          state.editor.currentSandbox!.privacy === 2
        );

        if (!effects.browserExtension.hasNotifiedImprovedScreenshots()) {
          state.preview.showExtensionBanner = true;
          effects.browserExtension.setNotifiedImprovedScreenshots();
        }
        effects.preview.showCommentCursor();
        state.preview.screenshot.isLoading = false;
        state.preview.screenshot.source = screenshot;
      }
    } catch (error) {
      effects.notificationToast.error(error.message);
    }
  };

  switch (existingMode) {
    case 'responsive':
      state.preview.mode = 'responsive-add-comment';
      await takeScreenshot();
      break;
    case 'add-comment':
      effects.preview.hideCommentCursor();
      state.preview.mode = null;
      break;
    case 'responsive-add-comment':
      effects.preview.hideCommentCursor();
      state.preview.mode = 'responsive';
      break;
    default:
      state.preview.mode = 'add-comment';
      await takeScreenshot();
  }

  if (state.preview.mode && state.preview.mode.includes('comment')) {
    effects.analytics.track('Preview Comment - Toggle', {
      mode: state.preview.mode,
    });
  }
};

export const checkURLParameters = ({ state, effects }: Context) => {
  const ULRResolutionWidth = effects.router.getParameter('resolutionWidth');
  const URLResolutionHeight = effects.router.getParameter('resolutionHeight');

  if (URLResolutionHeight && ULRResolutionWidth) {
    state.preview.mode = 'responsive';
    state.preview.responsive.resolution = [
      parseInt(ULRResolutionWidth, 10),
      parseInt(URLResolutionHeight, 10),
    ];
  }
};

export const setIsResizing = ({ state }: Context, newIsResizing: boolean) => {
  state.preview.responsive.isResizing = newIsResizing;
}