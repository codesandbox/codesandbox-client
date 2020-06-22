import browser from 'browser-detect';
import VERSION from '@codesandbox/common/lib/version';

interface IbuildCrashReport {
  error?: Error;
  trace?: string;
  errorCode: string | null;
}

export const buildCrashReport = ({
  error,
  trace,
  errorCode,
}: IbuildCrashReport): string => {
  const url = new URL(
    `https://github.com/codesandbox/codesandbox-client/issues/new`
  );
  const { name, version, os } = browser();

  // Only put commit sha inside the body, GitHub can parse this back to a link to commit.
  const commitSha = VERSION.split('-')[2];

  const errorCodeMessage = errorCode
    ? `**Error Code:**
${errorCode}`
    : ``;

  url.searchParams.set(
    `body`,
    `<h1>💥 Crash Report</h1>

  <h2>What were you trying to accomplish when the crash occurred?</h2>

  > Please use this issue template to describe what you were doing when you encountered this crash. While we are able to fill in some details automatically, it's not always enough to reproduce!

  <h3>Link to sandbox: [link]() (optional)</h3>

  <h3>Crash Details</h3>

  <details>
  <summary>Environment</summary>

  | Browser |  Version  | Operating System | CodeSandbox Version |
  | ------- | --------- | ---------------- | ------------------- |
  | ${name} | ${version} | ${os}           | ${commitSha}          |

  **Route:**
  ${window.location.href}

  ${errorCodeMessage}

  </details>

  <details>
  <summary>Error Message</summary>

  ${'```'}bash
  ${error}
  ${error.stack}
  ${trace}
  ${'```'}

  </details>
  `
  );

  url.searchParams.set(`labels`, `💥 Crash Report`);

  return url.toString();
};
