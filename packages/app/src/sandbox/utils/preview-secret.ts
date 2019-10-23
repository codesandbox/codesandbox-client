const PREVIEW_SECRET_COOKIE_NAME = 'csb_sandbox_secret';

export const getPreviewSecret = () =>
  document.cookie.replace(
    new RegExp(
      `(?:(?:^|.*;\\s*)${PREVIEW_SECRET_COOKIE_NAME}\\s*\\=\\s*([^;]*).*$)|^.*$`
    ),
    '$1'
  );

export const setPreviewSecret = (secret: string | null) => {
  if (secret === null) {
    return;
  }

  const cookieValue = getPreviewSecret();
  if (
    (cookieValue && !secret) ||
    (secret && !cookieValue) ||
    cookieValue !== secret
  ) {
    if (secret) {
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=${secret}`;
    } else {
      document.cookie = `${PREVIEW_SECRET_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
    }
    location.reload();
  }
};
