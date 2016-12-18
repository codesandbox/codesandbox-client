export const editModuleUrl = sandbox => (
  sandbox.author ? `/${sandbox.author}/${sandbox.slug}/module`
  : `/anonymous/${sandbox.slug}/module`
);
