export function rename(moduleId: string, title: string) {
  return {
    type: 'action',
    action: 'source.module.rename',
    moduleId,
    title,
  };
}
