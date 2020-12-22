export const getBaseUrl = (url: string) => {
  const match = url.match(/(https?:\/\/.*?)\//);

  if (match && match[1]) {
    return match[1];
  }

  return url;
};

export const getRelativeUrl = (url: string) => {
  const baseUrl = getBaseUrl(url);
  return url.replace(baseUrl, '') || '/';
};
