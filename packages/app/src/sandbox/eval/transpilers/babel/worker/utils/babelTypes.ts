let types: unknown = null;

/**
 * Load babel types if the fs is needed, it greatly speeds up compilation of
 * custom plugins and presets, but we don't want to include it in the main bundle.
 */
export function loadBabelTypes(): Promise<void> {
  return import('@babel/types').then(typesResult => {
    types = typesResult;
  });
}

export function getBabelTypes() {
  if (!types) {
    throw new Error("Babel types aren't loaded");
  }

  return types;
}
