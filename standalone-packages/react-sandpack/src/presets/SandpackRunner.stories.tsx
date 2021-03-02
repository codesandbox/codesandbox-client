import React, { useState } from 'react';
import { Story } from '@storybook/react';
import { SandpackRunner, SandpackRunnerProps } from './SandpackRunner';

export default {
  title: 'presets/Sandpack Runner',
  component: SandpackRunner,
};

const reactCode = `export default function App() {
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

export const ReactRunner: Story<SandpackRunnerProps> = args => (
  <SandpackRunner {...args} template="react" />
);

ReactRunner.args = {
  code: reactCode,
};

export const VueRunner: Story<SandpackRunnerProps> = args => (
  <SandpackRunner {...args} template="vue" theme="codesandbox-dark" />
);

VueRunner.args = {
  code: vueCode,
};

const reactAltCode = `export default function App() {
  return <p>Just a paragraph this time</p>
}
`;

export const SwitchExperiment = () => {
  const [codeToggle, setCodeToggle] = useState(false);

  return (
    <div>
      <SandpackRunner
        template="react"
        code={codeToggle ? reactAltCode : reactCode}
      />
      <button type="button" onClick={() => setCodeToggle(!codeToggle)}>
        Switch
      </button>
    </div>
  );
};
