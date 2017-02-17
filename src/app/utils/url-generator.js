export const host = () => (process.env.NODE_ENV === 'production' ? 'codesandbox.io' : 'codesandbox.dev');

export const sandboxUrl = sandbox => (
  sandbox.author ? `/${sandbox.author}/${sandbox.slug}`
  : `/anonymous/${sandbox.slug}`
);

export const editModuleUrl = sandbox => (
  `${sandboxUrl(sandbox)}/code`
);

export const versionsUrl = sandbox => (
  `${sandboxUrl(sandbox)}/versions`
);

export const sandboxInfoUrl = sandbox => (
  `${sandboxUrl(sandbox)}/info`
);

export const sandboxDependenciesUrl = sandbox => (
  `${sandboxUrl(sandbox)}/dependencies`
);

export const forkSandboxUrl = sandbox => (
  `${sandboxUrl(sandbox)}/fork`
);
