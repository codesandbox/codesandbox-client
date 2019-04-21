export const splitQueryFromPath = (path: string) => {
  const queryPath = path.split('!');
  // pop() mutates queryPath, queryPath is now just the loaders
  const modulePath = queryPath.pop();

  return {
    queryPath: queryPath.join('!'),
    modulePath,
  };
};
