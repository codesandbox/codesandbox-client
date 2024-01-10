import delay from '@codesandbox/common/lib/utils/delay';

export async function fetchWithRetries(
  url: string,
  retries = 2,
  requestInit?: RequestInit
): Promise<Response> {
  const doFetch = () =>
    window.fetch(url, requestInit).then(x => {
      if (x.ok) {
        return x;
      }

      const error: Error & {
        responseObject?: Response;
      } = new Error(`Could not fetch ${url}`);

      error.responseObject = x;

      throw error;
    });

  let lastTryTime = 0;
  for (let i = 0; i < retries; i++) {
    if (Date.now() - lastTryTime < 3000) {
      // Ensure that we at least wait 3s before retrying a request to prevent rate limits
      // eslint-disable-next-line
      await delay(3000 - (Date.now() - lastTryTime));
    }
    try {
      lastTryTime = Date.now();
      // eslint-disable-next-line
      return await doFetch();
    } catch (e) {
      console.error(e);
      if (i === retries - 1) {
        throw e;
      }
    }
  }

  throw new Error('Could not fetch');
}
