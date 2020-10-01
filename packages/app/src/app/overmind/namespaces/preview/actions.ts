import { Action } from 'app/overmind';
import { isEqual } from 'lodash-es';
import { json } from 'overmind';

export const toggleResponsiveMode: Action = ({ state }) => {
  if (state.preview.mode === 'responsive') {
    state.preview.mode = null;
  } else {
    state.preview.mode = 'responsive';
  }
};

export const setResolution: Action<[number, number]> = (
  { state },
  newResolution
) => {
  if (!newResolution) return null;

  state.preview.responsive.resolution = json(newResolution);
  return null;
};

export const openDeletePresetModal: Action = ({ state }) => {
  state.currentModal = 'deletePreset';
};

export const deletePreset: Action = ({ state }) => {
  const { presets, resolution } = state.preview.responsive;

  const activePresetName =
    Object.keys(presets).find(preset => isEqual(presets[preset], resolution)) ||
    'Custom';

  delete presets[activePresetName];
  state.preview.responsive.resolution = json(Object.values(presets)[0]);
};
