// @flow
import angular5 from './angular';
import vue from './vue';
import react from './react';
import reactTs from './react-ts';
import preact from './preact';
import svelte from './svelte';

export { angular5, vue, react, reactTs, preact, svelte };

export default function getDefinition(
  theme:
    | 'create-react-app'
    | 'vue-cli'
    | 'preact-cli'
    | 'svelte'
    | 'create-react-app-typescript'
    | 'angular5'
) {
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
    case angular5.name:
      return angular5;
    default:
      return react;
  }
}
