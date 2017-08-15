export function openModule(id: string, lineNumber: number = 1) {
  // TODO automatically add type: 'action', maybe do this after conversion to TS
  return {
    type: 'action',
    action: 'editor.open-module',
    moduleId: id,
    lineNumber,
  };
}
