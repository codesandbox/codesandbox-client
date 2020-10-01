import { RootState } from 'app/overmind';
import { derived } from 'overmind';

export type PresetType = { [name: string]: [number, number] };
type State = {
  responsive: {
    presets: PresetType;
    scale: number;
    resolution: [number, number];
    editMode: boolean;
  };
  mode: 'responsive' | null;
};

export const state: State = {
  responsive: {
    presets: derived((_, rootState: RootState) => {
      const workspaceConfig = JSON.parse(
        rootState.editor.workspaceConfigCode || '{}'
      );

      return (
        workspaceConfig['preview-presets'] || {
          Mobile: [320, 675],
          Tablet: [1024, 765],
          Desktop: [1920, 1080],
          'Desktop HD': [1400, 800],
        }
      );
    }),
    editMode: true,
    scale: 100,
    resolution: [320, 675],
  },
  mode: 'responsive',
};
