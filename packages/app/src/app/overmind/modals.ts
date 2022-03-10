/*
  You create modals "in place" where it makes most sense. You access the state of the modal
  with "state.modals.myModal" and you will have the following state and actions available:

  state.modals.myModal.isCurrent (Use to identify if it should be open)
  actions.modals.myModal.open() (Open it, with optional value matching its state)
  actions.modals.myModal.close() (Close it, with optional value matching its result)
*/

import { AlertModalComponents } from 'app/pages/common/Modals/GenericAlertModal';

export const forkFrozenModal = {
  result: 'fork' as 'fork' | 'cancel' | 'unfreeze',
};

export const newSandboxModal: {
  state: { collectionId?: null | string; initialTab?: 'Import' | null };
  result: undefined;
} = {
  state: { collectionId: null, initialTab: null },
  result: undefined,
};

export const moveSandboxModal: {
  state: {
    sandboxIds: string[];
    collectionIds?: string[];
    defaultOpenedPath?: string | null;
    preventSandboxLeaving?: boolean;
  };
  result: undefined;
} = {
  state: {
    sandboxIds: [],
    collectionIds: [],
    defaultOpenedPath: null,
    preventSandboxLeaving: false,
  },
  result: undefined,
};

export const alertModal: {
  state: {
    title: string;
    message?: string;
    type?: 'link' | 'primary' | 'danger' | 'secondary';
    customComponent?: keyof typeof AlertModalComponents;
  };
  result: boolean;
} = {
  state: { title: 'Are you sure?' },
  result: false,
};

export const extensionInstalledModal = {
  result: true,
};
