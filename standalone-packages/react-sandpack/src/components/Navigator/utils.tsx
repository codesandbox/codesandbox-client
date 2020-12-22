export const splitUrl = (url: string) => {
  const match = url.match(/(https?:\/\/.*?)\//);

  if (match && match[1]) {
    return [match[1], url.replace(match[1], '')];
  }

  return [url, '/'];
};
