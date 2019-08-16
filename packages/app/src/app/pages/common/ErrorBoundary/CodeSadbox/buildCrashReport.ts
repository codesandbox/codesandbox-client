import browser from 'browser-detect';

interface IbuildCrashReport {
  error?: Error;
  trace?: string;
}

export const buildCrashReport = ({
  error,
  trace,
}: IbuildCrashReport): string => {
  const { name, version, os } = browser();

  const title = `💥 Crash Report: <Short Description of Crash Circumstances>`;

  const body = `<h1>💥 Crash Report</h1>

<h2>What were you trying to accomplish when the crash occurred?</h2>

<h3>Link to sandbox: [link]() (optional)</h3>

<h3>Crash Details</h3>

<details>
<summary>Environment</summary>

| Browser |  Version  | Operating System |
| ------- | --------- | ---------------- |
| ${name} | ${version} | ${os}           |

</details>

<details>
<summary>Error Message</summary>

${'```'}bash
${error}
${error.stack}
${trace}
${'```'}

</details>
`;

  return `https://github.com/codesandbox/codesandbox-client/issues/new?title=${encodeURI(
    title
  )}&body=${encodeURI(body)}`;
};
