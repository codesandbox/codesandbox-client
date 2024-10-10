export function replaceGlob(
  source: string,
  target: string,
  specifier: string
): false | string {
  const starIndex = source.indexOf('*');
  if (starIndex < 0) {
    return false;
  }

  const prefix = source.substring(0, starIndex);
  const suffix = source.substring(starIndex + 1);
  if (
    !specifier.startsWith(prefix) ||
    (suffix && !specifier.endsWith(suffix))
  ) {
    return false;
  }

  const targetStarLocation = target.indexOf('*');
  const targetBeforeStar = target.substring(0, targetStarLocation);

  if (specifier.indexOf(targetBeforeStar) > -1) {
    return (
      targetBeforeStar +
      specifier.substring(targetBeforeStar.length, specifier.length)
    );
  }

  if (targetStarLocation < 0) {
    return target;
  }

  const globPart = specifier.substring(
    prefix.length,
    specifier.length - suffix.length
  );
  return (
    target.substring(0, targetStarLocation) +
    globPart +
    target.substring(targetStarLocation + 1)
  );
}
