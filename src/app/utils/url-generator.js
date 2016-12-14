export const editModuleUrl = sandbox => (
  sandbox.author ? `/${sandbox.author}/${sandbox.slug}/module`
  : `/sandbox/${sandbox.id}/module`
);
