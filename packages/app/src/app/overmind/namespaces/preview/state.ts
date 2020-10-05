import { RootState } from 'app/overmind';
import { derived } from 'overmind';

export type Presets = { [name: string]: [number, number] };

type State = {
  responsive: {
    presets: Presets;
    scale: number;
    resolution: [number, number];
  };
  mode: 'responsive' | null;
};

export const defaultPresets: Presets = {
  Mobile: [320, 675],
  Tablet: [1024, 765],
  Desktop: [1920, 1080],
  'Desktop HD': [1400, 800],
};

export const state: State = {
  responsive: {
    presets: derived((_, rootState: RootState) =>
      rootState.editor.workspaceConfig &&
      rootState.editor.workspaceConfig['responsive-preview']
        ? rootState.editor.workspaceConfig['responsive-preview']
        : defaultPresets
    ),
    scale: 100,
    resolution: [320, 675],
  },
  mode: 'responsive',
};
