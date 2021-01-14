import { SandboxTemplate } from '../types';

export const REACT_TEMPLATE: SandboxTemplate = {
  files: {
    '/App.js': {
      code: `import React from 'react';

export default function App() {
return <h1>Hello World</h1>
}
`,
    },
    '/index.js': {
      code: `import { render } from 'react-dom';
import React from 'react';
import App from './App.js';
import './styles.css';

render(<App />, document.getElementById('root'))`,
    },
    '/styles.css': {
      code: `body {
font-family: sans-serif;
-webkit-font-smoothing: auto;
-moz-font-smoothing: auto;
-moz-osx-font-smoothing: grayscale;
font-smoothing: auto;
text-rendering: optimizeLegibility;
font-smooth: always;
-webkit-tap-highlight-color: transparent;
-webkit-touch-callout: none;
}

h1 {
font-size: 1.5rem;
}`,
    },
    '/public/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<div id="root"></div>
</body>
</html>`,
    },
  },
  dependencies: {
    react: 'latest',
    'react-dom': 'latest',
    'react-refresh': 'latest',
    '@babel/runtime': 'latest',
  },
  entry: '/index.js',
  main: '/App.js',
  environment: 'create-react-app',
};
