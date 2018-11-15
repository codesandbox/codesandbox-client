import { resolveDependencyInfo } from './resolve-dependency';
import { mergeDependencies } from './merge-dependency';

export async function getDependencyVersions(dependencies) {
  const depInfos = await Promise.all(
    Object.keys(dependencies).map(depName =>
      resolveDependencyInfo(depName, dependencies[depName])
    )
  );

  return mergeDependencies(depInfos);
}
