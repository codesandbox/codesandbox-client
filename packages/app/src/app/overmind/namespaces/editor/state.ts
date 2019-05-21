import { Sandbox } from '@codesandbox/common/lib/types';
import { Tab } from 'app/components/CodeEditor/types';

type State = {
  error: string;
  currentId: string;
  sandboxes: {
    [id: string]: Sandbox;
  };
  currentSandbox: Sandbox;
  changedModuleShortids: string[];
  tabs: Tab[];
};

export const state: State = {
  error: null,
  currentId: null,
  sandboxes: {},
  changedModuleShortids: [],
  tabs: [],
  get currentSandbox() {
    const state: State = this;

    return state.sandboxes[state.currentId];
  },
};
