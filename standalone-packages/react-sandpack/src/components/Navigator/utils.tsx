export const getBaseUrl = (url: string) => {
  const match = url.match(/(https?:\/\/.*?)\//);

  if (match && match[1]) {
    return match[1];
  }

  return url;
};

export const getUrlState = (url: string) => {
  const baseUrl = getBaseUrl(url);
  const browserPath = url.replace(baseUrl, '') || '/';

  return {
    baseUrl,
    browserPath,
    lastCommittedUrl: url,
  };
};
