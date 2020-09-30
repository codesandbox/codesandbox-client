import { Action } from 'app/overmind';
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
