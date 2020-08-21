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
  };
  result: undefined;
} = {
  state: { sandboxIds: [], collectionIds: [], defaultOpenedPath: null },
  result: undefined,
};
