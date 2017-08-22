import { decorateSelector } from '../theme';

export const react = {
  name: 'create-react-app',
  url: 'https://github.com/facebookincubator/create-react-app',
  color: decorateSelector(() => '#6CAEDD'),
};

export const vue = {
  name: 'vue-cli',
  url: 'https://github.com/vuejs/vue-cli',
  color: decorateSelector(() => '#41B883'),
};

export const preact = {
  name: 'preact-cli',
  url: 'https://github.com/developit/preact-cli',
  color: decorateSelector(() => '#AD78DC'),
};

export default function getDefinition(
  theme: 'create-react-app' | 'vue-cli' | 'preact-cli',
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
    default:
      return react;
  }
}
