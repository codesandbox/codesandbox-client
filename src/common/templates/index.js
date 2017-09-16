import { decorateSelector } from '../theme';

export const react = {
  name: 'create-react-app',
  url: 'https://github.com/facebookincubator/create-react-app',
  color: decorateSelector(() => '#6CAEDD'),

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd build && serve -s ./',
      },
    },
  }),
};

export const reactTs = {
  name: 'create-react-app-typescript',
  url: 'https://github.com/wmonk/create-react-app-typescript',
  color: decorateSelector(() => '#009fff'),

  sourceConfig: {
    typescript: true,
    entry: 'index.tsx',
  },
};

export const vue = {
  name: 'vue-cli',
  url: 'https://github.com/vuejs/vue-cli',
  color: decorateSelector(() => '#41B883'),

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd dist && serve -s ./',
      },
    },
  }),
};

export const svelte = {
  name: 'svelte',
  url: 'https://github.com/sveltejs/svelte',
  color: decorateSelector(() => '#AA1E1E'),

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd public && serve -s ./',
      },
    },
  }),
};

export const preact = {
  name: 'preact-cli',
  url: 'https://github.com/developit/preact-cli',
  color: decorateSelector(() => '#AD78DC'),

  alterDeploymentData: apiData => ({
    ...apiData,
    package: {
      ...apiData.package,
      devDependencies: {
        ...apiData.package.devDependencies,
        serve: '^5.0.1',
      },
      scripts: {
        ...apiData.package.scripts,
        'now-start': 'cd build && serve -s ./',
      },
    },
  }),
};

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'create-react-app-typescript'
) {
  if (!theme) {
    return react;
  }

  switch (theme) {
    case react.name:
      return react;
    case vue.name:
      return vue;
    case preact.name:
      return preact;
    case reactTs.name:
      return reactTs;
    case svelte.name:
      return svelte;
    default:
      return react;
  }
}
