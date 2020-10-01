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
  if (!newResolution) return;

  state.preview.responsive.resolution = json(newResolution);
};

export const openDeletePresetModal: Action = ({ state }) => {
  state.currentModal = 'deletePreset';
};

export const openAddPresetModal: Action = ({ state }) => {
  state.currentModal = 'addPreset';
};

export const deletePreset: Action = ({ state }) => {
  const { presets, resolution } = state.preview.responsive;

  const activePresetName = Object.keys(presets).find(preset =>
    isEqual(presets[preset], resolution)
  );

  if (activePresetName) {
    delete presets[activePresetName.toString()];
    state.preview.responsive.resolution = json(Object.values(presets)[0]);
  }
};

export const addPreset: Action<{
  name: string;
  width: number;
  height: number;
}> = ({ state }, { name, width, height }) => {
  if (!name || !width || !height) return;

  state.preview.responsive.presets = {
    ...state.preview.responsive.presets,
    [name]: [width, height],
  };

  state.preview.responsive.resolution = [width, height];
};
