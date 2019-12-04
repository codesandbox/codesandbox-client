export default (dependencies: Object) =>
  Object.keys(dependencies)
    .sort()
    .map(name => encodeURIComponent(`${name}@${dependencies[name]}`))
    .join('+');
