import { RootState } from 'app/overmind';
import { derived } from 'overmind';

export type Presets = { [name: string]: [number, number] };

type State = {
  responsive: {
    presets: Presets;
    scale: number;
    resolution: [number, number];
    editMode: boolean;
  };
  mode: 'responsive' | null;
};

export const state: State = {
  responsive: {
    presets: derived((_, rootState: RootState) =>
      rootState.editor.workspaceConfig
        ? rootState.editor.workspaceConfig['responsive-preview']
        : {}
    ),
    editMode: true,
    scale: 100,
    resolution: [320, 675],
  },
  mode: 'responsive',
};
