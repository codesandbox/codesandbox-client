import { decorateSelector } from '../theme';

export const react = {
  name: 'create-react-app',
  color: decorateSelector(() => '#6CAEDD'),
};

export const vue = {
  name: 'vue-cli',
  color: decorateSelector(() => '#41B883'),
};

export default function getDefinition(theme: 'create-react-app' | 'vue-cli') {
  if (theme === react.name) {
    return react;
  } else if (theme === vue.name) {
    return vue;
  }

  return react;
}
