export function hasLogIn(): boolean {
  const hasDevAuth = process.env.LOCAL_SERVER || process.env.STAGING;

  return Boolean(
    typeof document !== 'undefined' &&
      (document.cookie.indexOf('signedIn') > -1 ||
        (hasDevAuth && document.cookie.indexOf('signedInDev') > -1))
  );
}
