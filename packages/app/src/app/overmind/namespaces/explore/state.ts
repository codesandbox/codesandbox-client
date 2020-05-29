import {
  PickedSandboxDetails,
  PickedSandboxes,
  PopularSandboxes,
  Sandbox,
} from '@codesandbox/common/es/types';

type State = {
  pickedSandboxesIndexes: string[] | null;
  popularSandboxes: PopularSandboxes | null;
  pickedSandboxesLoading: boolean;
  pickedSandboxes: PickedSandboxes | null;
  selectedSandbox: Sandbox | null;
  pickedSandboxDetails: PickedSandboxDetails | null;
};

export const state: State = {
  popularSandboxes: null,
  pickedSandboxes: null,
  pickedSandboxesIndexes: null,
  pickedSandboxesLoading: false,
  selectedSandbox: null,
  pickedSandboxDetails: null,
};
