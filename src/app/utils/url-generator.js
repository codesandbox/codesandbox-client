export const editModuleUrl = (sandbox, user = null) => (
  user ? `/${user.username}/${sandbox.slug}/module`
  : `/sandbox/${sandbox.id}/module`
);
