import { SandboxTemplate } from '../types';

export const REACT_TEMPLATE: SandboxTemplate = {
  files: {
    '/App.js': {
      code: `export default function App() {
  return <h1>Hello World</h1>
}
`,
    },
    '/index.js': {
      code: `import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import "./styles.css";

import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  rootElement
);`,
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
    react: '^17.0.0',
    'react-dom': '^17.0.0',
    'react-scripts': '^4.0.0',
  },
  entry: '/index.js',
  main: '/App.js',
  environment: 'create-react-app',
};
