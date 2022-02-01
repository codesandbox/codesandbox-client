export default async ({
  feedback,
  emoji,
  sandboxId,
  username,
  email,
  version,
  browser,
}: {
  [key: string]: string;
}) => {
  /**
   * @see https://codesandbox.io/s/feedback-microservice-sp8i0
   */
  return fetch('https://sp8i0.sse.codesandbox.io/airtable', {
    method: 'POST',
    body: JSON.stringify({
      feedback,
      emoji,
      sandboxId,
      username,
      email,
      url: window.location.pathname,
      version,
      browser,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).catch(error => {
    if (error) {
      console.error(error);
    }
  })
};
