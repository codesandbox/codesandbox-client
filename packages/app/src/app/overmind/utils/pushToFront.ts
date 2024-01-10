export default ({
  feedback,
  sandboxId,
  username,
  email,
  version,
  browser,
}: {
  [key: string]: string;
}) =>
  fetch('https://s2973-8080.csb.app/inbound-message', {
    method: 'POST',
    body: JSON.stringify({
      name: username,
      email,
      body:
        feedback +
        '\n\nSandbox: https://codesandbox.io/s/' +
        sandboxId +
        '\nVersion: ' +
        version +
        '\nBrowser: ' +
        browser,
    }),
    headers: {
      'Content-Type': 'application/json',
      Accept: '*/*',
    },
  });
