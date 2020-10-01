import { derived } from 'overmind';

type PresetType = { [name: string]: [number, number] };
type State = {
  responsive: {
    defaultPresets: PresetType;
    presets: PresetType;
    scale: number;
    resolution: [number, number];
  };
  mode: 'responsive' | null;
};

export const state: State = {
  responsive: {
    defaultPresets: {
      Mobile: [320, 675],
      Tablet: [1024, 765],
      Desktop: [1920, 1080],
      'Desktop HD': [1400, 800],
    },
    presets: derived(
      (currentState: State['responsive']) => currentState.defaultPresets
    ),
    scale: 100,
    resolution: [320, 675],
  },
  mode: 'responsive',
};
