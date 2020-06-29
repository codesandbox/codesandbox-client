export const forkFrozenModal = {
  result: 'fork' as 'fork' | 'cancel' | 'unfreeze',
};

export const newSandboxModal: {
  state: { collectionId?: null | string };
  result: undefined;
} = {
  state: { collectionId: null },
  result: undefined,
};
