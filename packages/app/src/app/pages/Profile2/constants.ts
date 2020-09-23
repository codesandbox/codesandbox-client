export const SANDBOXES_PER_PAGE = 15;

export const SandboxTypes = {
  ALL_SANDBOX: 'ALL_SANDBOX' as const,
  PINNED_SANDBOX: 'PINNED_SANDBOX' as const,
  DEFAULT_SANDBOX: 'DEFAULT_SANDBOX' as const,
};

export type SandboxType = keyof typeof SandboxTypes;

export const DropTargets = {
  SHOWCASED_SANDBOX: 'SHOWCASED_SANDBOX' as const,
  PINNED_SANDBOXES: 'PINNED_SANDBOXES' as const,
};

export type DropTarget = keyof typeof DropTargets;
