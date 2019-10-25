import { resolveDependencyInfo } from './resolve-dependency';
import { mergeDependencies } from './merge-dependency';

import { parseResolutions } from './resolutions';

export async function getDependencyVersions(
  dependencies: {
    [depName: string]: string;
  },
  resolutions?: { [startGlob: string]: string }
) {
  const parsedResolutions = parseResolutions(resolutions);

  const depInfos = await Promise.all(
    Object.keys(dependencies).map(depName =>
      resolveDependencyInfo(depName, dependencies[depName], parsedResolutions)
    )
  );

  return mergeDependencies(depInfos);
}
