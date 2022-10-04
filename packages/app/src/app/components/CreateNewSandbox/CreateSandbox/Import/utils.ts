export const getOwnerAndNameFromInput = (githubUrl: string) => {
  // Will match the following:
  // git@github.com:{owner}/{name}
  // git@github.com:{owner}/{name}.git
  // https://gitbub.com/{owner}/{name}
  const match = githubUrl.match(
    // eslint-disable-next-line no-useless-escape
    /^(https|git)(:\/\/|@)([^\/:]+)[\/:]([^\/:]+)\/(.+)$/
  );

  const owner = match?.[4];
  const name = match?.[5];

  // make sure we only take the repo name until the first slash
  const nameParts = name?.split('/') || [];

  return { owner, name: nameParts[0] };
};
