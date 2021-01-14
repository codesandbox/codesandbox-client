import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { CodeRunner, CodeRunnerProps } from './CodeRunner';

export default {
  title: 'presets/Code Runner',
  component: CodeRunner,
};

const reactCode = `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}
`;

const vueCode = `<template>
  <main id="app">
    <h1>Hello world</h1>
  </main>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
`;

export const ReactRunner: Story<CodeRunnerProps> = args => (
  <CodeRunner {...args} template="react" />
);

ReactRunner.args = {
  code: reactCode,
};

export const VueRunner: Story<CodeRunnerProps> = args => (
  <CodeRunner {...args} template="vue" />
);

VueRunner.args = {
  code: vueCode,
};

const reactAltCode = `import React from 'react';

export default function App() {
  return <p>Just a paragraph this time</p>
}
`;

export const SwitchExperiment = () => {
  const [codeToggle, setCodeToggle] = useState(false);

  return (
    <div>
      <CodeRunner
        template="react"
        code={codeToggle ? reactAltCode : reactCode}
      />
      <button type="button" onClick={() => setCodeToggle(!codeToggle)}>
        Switch
      </button>
    </div>
  );
};
