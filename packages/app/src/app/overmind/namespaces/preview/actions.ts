import { hasPermission } from '@codesandbox/common/lib/utils/permission';
import track from '@codesandbox/common/lib/utils/analytics';
import { Action, AsyncAction } from 'app/overmind';
import { isEqual } from 'lodash-es';
import { json } from 'overmind';
import { Presets, defaultPresets } from './state';

export const toggleResponsiveMode: AsyncAction = async ({
  state,
  actions,
  effects,
}) => {
  const newUrl = new URL(document.location.href);
  if (state.preview.mode === 'responsive') {
    state.preview.mode = null;
    newUrl.searchParams.delete('resolutionWidth');
    newUrl.searchParams.delete('resolutionHeight');
  } else {
    track('Responsive Preview - Toggled On');
    state.preview.mode = 'responsive';

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
  }
  if (newUrl) {
    effects.router.replace(
      newUrl.toString().replace(/%2F/g, '/').replace('%3A', ':')
    );
  }
};

export const setResolution: Action<[number, number]> = (
  { state, effects },
  newResolution
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

export const openDeletePresetModal: Action = ({ state }) => {
  state.currentModal = 'deletePreset';
};

export const openAddPresetModal: Action = ({ state }) => {
  state.currentModal = 'addPreset';
};

export const toggleEditPresets: Action = ({ state }) => {
  state.currentModal = 'editPresets';
};

export const deletePreset: AsyncAction = async ({ state, actions }) => {
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

export const addPreset: AsyncAction<{
  name: string;
  width: number;
  height: number;
}> = async ({ state, actions }, { name, width, height }) => {
  if (!name || !width || !height) return;
  track('Responsive Preview - Preset Created', {
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

export const editPresets: AsyncAction<Presets> = async (
  { actions },
  newPresets
) => {
  await actions.files.updateWorkspaceConfig({
    'responsive-preview': newPresets,
  });
};

export const checkURLParameters: Action = ({ state, effects }) => {
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
