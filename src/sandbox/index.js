import axios from 'axios';

import delay from './utils/delay';
import buildError from './utils/error-message-builder';
import evalModule from './utils/eval-module';
import ReactMode from './modes/ReactMode';
import createEntity from '../app/store/entities/create-entity';

let errorHappened = false;
let lastMode = null;
const rootElement = document.createElement('div');
let dependencyStatus = null;
let dependencyManifest = null;
document.body.appendChild(rootElement);

async function addDependencyBundle(url: string, manifest) {
  const script = document.createElement('script');
  script.setAttribute('src', url);
  script.setAttribute('async', false);
  document.body.appendChild(script);

  while (window.dependencies == null) {
    await delay(100);
  }
  dependencyManifest = manifest;
  dependencyStatus = 'done';
}

async function fetchDependencies(sourceId) {
  if (dependencyStatus === 'fetching') return false;

  dependencyStatus = 'fetching';
  const initialResult = (await axios({
    method: 'POST',
    url: '/bundle',
    data: {
      id: sourceId,
    },
  }));

  const { hash, url, manifest } = initialResult.data;
  if (manifest) {
    await addDependencyBundle(url, manifest);
  } else {
    // Loop requesting
    while (dependencyManifest == null) {
      await delay(1000);
      const result = await axios({
        method: 'GET',
        url: `/bundle/${hash}`,
      });

      if (result.data.error) {
        console.error(result.data.error);
        return false;
      }

      if (result.data.manifest) {
        await addDependencyBundle(result.data.url, result.data.manifest);
      }
    }
  }
  return true;
}

window.addEventListener('message', async (message) => {
  const { modules, directories, module, sourceId } = message.data;

  if (dependencyStatus == null || dependencyStatus === 'fetching') {
    const success = await fetchDependencies(sourceId);
    if (!success) return;
  }

  try {
    const compiledModule = evalModule(module, modules, directories, dependencyManifest.content);
    const mode = module.type; // eslint-disable-line no-underscore-dangle

    if (lastMode == null || lastMode.type !== mode) {
      while (rootElement.hasChildNodes()) {
        rootElement.removeChild(rootElement.lastChild);
      }
    }

    if (mode === 'react') {
      if (lastMode == null || lastMode.type !== 'react') {
        // Use the functions of the dependencies
        const React = window.dependencies(dependencyManifest.content.react.id);
        const ReactDOM = window.dependencies(dependencyManifest.content['react-dom'].id);
        lastMode = new ReactMode(rootElement, React, ReactDOM);
      }
      lastMode.render(compiledModule.default, !!errorHappened);
    } else {
      lastMode = null;
    }

    errorHappened = false;
    window.parent.postMessage({
      type: 'success',
    }, '*');
  } catch (e) {
    console.error(e);
    errorHappened = true;
    window.parent.postMessage({
      type: 'error',
      error: buildError(e),
    }, '*');
  }
});

window.parent.postMessage('Ready!', '*');
