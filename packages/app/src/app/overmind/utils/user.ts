export function hasLogIn() {
  return (
    typeof document !== 'undefined' && document.cookie.indexOf('signedIn') > -1
  );
}
