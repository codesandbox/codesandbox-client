import React from 'react';

import { SandpackTranspiledCode } from './index';
import { SandpackLayout } from '../../common/Layout';
import { SandpackStack } from '../../common/Stack';
import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackCodeEditor } from '../CodeEditor';

export default {
  title: 'components/Transpiled Code View',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: `const text = 'Hello World!'
const str = \`<div>\${text}</div>\`
`,
        },
      },
      dependencies: { '@babel/runtime': 'latest' },
    }}
  >
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
    </SandpackLayout>
  </SandpackProvider>
);
