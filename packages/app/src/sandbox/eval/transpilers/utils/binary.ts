import { Module } from 'sandbox/eval/types/module';

export function getModuleHTTPPath(module: Module, sandboxId: string | null) {
  if (!sandboxId) {
    return module.path;
  }

  return `https://codesandbox.stream/api/v1/sandboxes/${sandboxId}/fs${module.path}`;
}
