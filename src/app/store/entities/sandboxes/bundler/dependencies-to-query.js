export default (dependencies: Object) =>
  Object.keys(dependencies)
    .sort()
    .map(name => `${name}@${dependencies[name]}`)
    .join('+');
