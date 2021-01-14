import { SandboxTemplate } from '../types';

export const VANILLA_TEMPLATE: SandboxTemplate = {
  files: {
    '/src/index.js': {
      code: `import "./styles.css";

document.getElementById("app").innerHTML = \`
<h1>Hello Vanilla!</h1>
<div>
  We use the same configuration as Parcel to bundle this sandbox, you can find more
  info about Parcel 
  <a href="https://parceljs.org" target="_blank" rel="noopener noreferrer">here</a>.
</div>
\`;
`,
    },
    '/src/styles.css': {
      code: `body {
  font-family: sans-serif;
}
      `,
    },
    '/index.html': {
      code: `<!DOCTYPE html>
<html>

<head>
  <title>Parcel Sandbox</title>
  <meta charset="UTF-8" />
</head>

<body>
  <div id="app"></div>

  <script src="src/index.js">
  </script>
</body>

</html>`,
    },
  },
  dependencies: {},
  entry: '/src/index.js',
  main: '/src/index.js',
  environment: 'parcel',
};
