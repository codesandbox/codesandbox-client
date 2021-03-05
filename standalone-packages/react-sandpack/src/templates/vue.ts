import { SandboxTemplate } from '../types';

export const VUE_TEMPLATE: SandboxTemplate = {
  files: {
    '/src/App.vue': {
      code: `<template>
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
`,
    },
    '/src/main.js': {
      code: `import Vue from "vue";
import App from "./App.vue";

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
`,
    },
    '/public/index.html': {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title>codesandbox</title>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but codesandbox doesn't work properly without JavaScript
        enabled. Please enable it to continue.</strong
      >
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
`,
    },
  },
  dependencies: {
    vue: '^2.6.11',
    '@vue/cli-plugin-babel': '4.1.1',
  },
  entry: '/src/main.js',
  main: '/src/App.vue',
  environment: 'vue-cli',
};
