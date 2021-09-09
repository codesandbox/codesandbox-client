const URL_RE = /^https?:\/\/.+/;

export function isUrl(url: string) {
  return URL_RE.test(url);
}
