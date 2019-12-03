/**
 * We set savedCode to null if it's the same as code for memory/bandwidth reasons,
 * this function returns the savedCode based on the two values.
 */
export const getSavedCode = (
  code: string | undefined,
  savedCode: string | undefined | null
) => {
  if (savedCode === null) {
    return code || '';
  }

  return savedCode || '';
};
