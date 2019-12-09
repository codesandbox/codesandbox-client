import { mergeDependencies } from './merge-dependency';
import { parseResolutions } from './resolutions';
import { resolveDependencyInfo } from './resolve-dependency';

export async function getDependencyVersions(
  dependencies: {
    [depName: string]: string;
  },
  resolutions: { [startGlob: string]: string },
  _: boolean
) {
  const parsedResolutions = parseResolutions(resolutions);

  const depsWithNodeLibs = { 'node-libs-browser': '2.2.0', ...dependencies };
  const depInfos = await Promise.all(
    Object.keys(depsWithNodeLibs).map(depName =>
      resolveDependencyInfo(
        depName,
        depsWithNodeLibs[depName],
        parsedResolutions
      )
    )
  );

  return mergeDependencies(depInfos);
}
