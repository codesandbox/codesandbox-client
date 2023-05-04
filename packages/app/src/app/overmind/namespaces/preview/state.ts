import { Context } from 'app/overmind';
import { derived } from 'overmind';

export type Presets = { [name: string]: [number, number] };

type Mode = 'responsive' | 'add-comment' | 'responsive-add-comment' | null;

type State = {
  responsive: {
    presets: Presets;
    scale: number;
    resolution: [number, number];
    isResizing: boolean;
  };
  screenshot: {
    source: string | null;
    isLoading: boolean;
  };
  mode: Mode;
  hasExtension: boolean;
  showExtensionBanner: boolean;
};

export const defaultPresets: Presets = {
  Mobile: [320, 675],
  Tablet: [1024, 765],
  Desktop: [1400, 800],
  'Desktop HD': [1920, 1080],
};

export const state: State = {
  responsive: {
    presets: derived((_, rootState: Context['state']) =>
      rootState.editor.workspaceConfig &&
      rootState.editor.workspaceConfig['responsive-preview']
        ? rootState.editor.workspaceConfig['responsive-preview']
        : defaultPresets
    ),
    scale: 100,
    resolution: [320, 675],
    isResizing: false
  },
  screenshot: {
    source: null,
    isLoading: false,
  },
  mode: null,
  hasExtension: false,
  showExtensionBanner: false,
};
