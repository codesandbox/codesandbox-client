import { Action, AsyncAction } from 'app/overmind';
import { isEqual } from 'lodash-es';
import { json } from 'overmind';
import { Presets, defaultPresets } from './state';

export const toggleResponsiveMode: AsyncAction = async ({ state, actions }) => {
  if (state.preview.mode === 'responsive') {
    state.preview.mode = null;
  } else {
    state.preview.mode = 'responsive';
    if (!state.editor.workspaceConfig) {
      actions.files.updateWorkspaceConfig(
        JSON.stringify({
          'responsive-preview': defaultPresets,
        })
      );
    }
  }
};

export const setResolution: Action<[number, number]> = (
  { state },
  newResolution
) => {
  if (!newResolution) return;

  state.preview.responsive.resolution = json(newResolution);
};

export const openDeletePresetModal: Action = ({ state }) => {
  state.currentModal = 'deletePreset';
};

export const openAddPresetModal: Action = ({ state }) => {
  state.currentModal = 'addPreset';
};

export const toggleEditPresets: Action = ({ state }) => {
  state.preview.responsive.editMode = !state.preview.responsive.editMode;
};

export const deletePreset: AsyncAction = async ({ state, actions }) => {
  const { presets, resolution } = state.preview.responsive;

  const activePresetName = Object.keys(presets).find(preset =>
    isEqual(presets[preset], resolution)
  );

  if (activePresetName) {
    state.preview.responsive.resolution = json(Object.values(presets)[0]);

    const workspaceConfig = state.editor.workspaceConfig!;
    const presetsCopy = json(workspaceConfig['responsive-preview'] || {});
    delete presetsCopy[activePresetName.toString()];
    // Should not pass a string here, need to refactor the devtool tabs
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
  state.preview.responsive.resolution = [width, height];
  const workspaceConfig = state.editor.workspaceConfig!;
  const presetsCopy = json(workspaceConfig['responsive-preview'] || {});
  presetsCopy[name] = [width, height];
  // Should not pass a string here, need to refactor the devtool tabs
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
