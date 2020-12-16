import React from 'react';
import { BasicEditor } from '../presets/BasicEditor';

export default {
  title: 'presets/Basic Editor',
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

export const ReactEditor = () => (
  <BasicEditor code={reactCode} showNavigator template="cra" />
);

export const VueEditor = () => <BasicEditor code={vueCode} template="vue" />;
