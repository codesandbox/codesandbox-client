import React from 'react';

import { TranspiledCodeView } from '../components/TranspiledCodeView';
import { SandpackWrapper } from '../elements';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from './CodeEditor';

export default {
  title: 'components/Transpiled Code View',
};

export const Component = () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `const text = 'Hello World!'
const str = \`<div>\${text}</div>\`
`,
      },
    }}
    dependencies={{ '@babel/runtime': 'latest' }}
    entry="/index.js"
  >
    <SandpackWrapper>
      <CodeEditor />
      <TranspiledCodeView />
    </SandpackWrapper>
  </SandpackProvider>
);
