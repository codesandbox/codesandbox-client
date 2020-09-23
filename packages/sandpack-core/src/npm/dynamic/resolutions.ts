/**
 * Parse input strings like `package-1/package-2` to an array of packages
 */
function parsePackagePath(input: string) {
  return input.match(/(@[^/]+\/)?([^/]+)/g) || [];
}

const WRONG_PATTERNS = /\/$|\/{2,}|\*+$/;
const GLOBAL_NESTED_DEP_PATTERN = '**/';

function isValidPackagePath(input: string) {
  return !WRONG_PATTERNS.test(input);
}

export interface IParsedResolution {
  name: string;
  range: string;
  globPattern: string;
  pattern: string;
}

export function parsePatternInfo(
  globPattern: string,
  range: string
): IParsedResolution | null {
  if (!isValidPackagePath(globPattern)) {
    console.warn('invalidResolutionName');
    return null;
  }

  const directories = parsePackagePath(globPattern);
  const name = directories.pop()!;

  // For legacy support of resolutions, replace `name` with `**/name`
  if (name === globPattern) {
    // eslint-disable-next-line
    globPattern = `${GLOBAL_NESTED_DEP_PATTERN}${name}`;
  }

  return {
    name,
    range,
    globPattern,
    pattern: `${name}@${range}`,
  };
}

export function parseResolutions(resolutions?: {
  [name: string]: string;
}): IParsedResolution[] {
  if (!resolutions) {
    return [];
  }

  const keys = Object.keys(resolutions);
  return keys
    .map(key => parsePatternInfo(key, resolutions[key]))
    .filter(Boolean) as IParsedResolution[];
}
