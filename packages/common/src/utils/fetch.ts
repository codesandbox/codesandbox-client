import delay from './delay';

export interface FetchInitOpts extends RequestInit {
  timeout?: number;
  retries?: number;
}

export async function fetchWithTimeout(
  url: string,
  opts: FetchInitOpts = {}
): Promise<Response> {
  const ms = opts.timeout ?? 10000;
  return new Promise((resolve, reject) => {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutRef = setTimeout(() => {
      controller.abort();
      reject(new Error('Request timed out'));
    }, ms);

    window
      .fetch(url, { ...opts, signal })
      .then(resolve)
      .catch(reject)
      .finally(() => {
        clearTimeout(timeoutRef);
      });
  });
}

export async function fetchWithRetries(
  url: string,
  opts?: FetchInitOpts
): Promise<Response> {
  const retries = opts.retries || 5;
  const doFetch = () =>
    fetchWithTimeout(url, opts).then(x => {
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
      const res = await doFetch();
      return res;
    } catch (err) {
      console.error(err);
      if (i === retries - 1) {
        throw err;
      }
    }
  }

  throw new Error('Could not fetch');
}
