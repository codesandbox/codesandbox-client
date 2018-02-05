import { dispatch, clearErrorTransformers } from 'codesandbox-api';
import { absolute } from 'common/utils/path';
import _debug from 'app/utils/debug';
import parseConfigurations from 'common/templates/configuration/parse';

import initializeErrorTransformers from './errors/transformers';
import getPreset from './eval';
import Manager from './eval/manager';

import { resetScreen } from './status-screen';

import { inject, unmount } from './react-error-overlay/overlay';
import handleExternalResources from './external-resources';

import defaultBoilerplates from './boilerplates/default-boilerplates';
import resizeEventListener from './resize-event-listener';
import {
  getBoilerplates,
  evalBoilerplates,
  findBoilerplate,
} from './boilerplates';

import loadDependencies from './npm';
import getDefinition from '../../../common/templates/index';

let initializedResizeListener = false;
let manager: ?Manager = null;
let actionsEnabled = false;

const debug = _debug('cs:compiler');

export function areActionsEnabled() {
  return actionsEnabled;
}

export function getCurrentManager(): ?Manager {
  return manager;
}

let firstLoad = true;
let hadError = false;

// TODO make devDependencies lazy loaded by the packager
const WHITELISTED_DEV_DEPENDENCIES = [
  'redux-devtools',
  'redux-devtools-dock-monitor',
  'redux-devtools-log-monitor',
  'redux-logger',
  'enzyme',
  'react-addons-test-utils',
  'react-test-renderer',
  'identity-obj-proxy',
];

function getDependencies(parsedPackage) {
  const {
    dependencies: d = {},
    peerDependencies = {},
    devDependencies = {},
  } = parsedPackage;

  const returnedDependencies = { ...d, ...peerDependencies };

  Object.keys(devDependencies).forEach(dep => {
    if (WHITELISTED_DEV_DEPENDENCIES.indexOf(dep) > -1) {
      returnedDependencies[dep] = devDependencies[dep];
    }
  });

  return returnedDependencies;
}

async function updateManager(
  sandboxId,
  template,
  managerModules,
  manifest,
  configurations,
  isNewCombination
) {
  let newManager = false;
  if (!manager || manager.id !== sandboxId) {
    newManager = true;
    manager = new Manager(sandboxId, getPreset(template), managerModules);
    if (firstLoad) {
      // We save the state of transpiled modules, and load it here again. Gives
      // faster initial loads.

      await manager.load();
    }
  }

  if (isNewCombination || newManager) {
    manager.setManifest(manifest);
  }
  manager.updateConfigurations(configurations);
  await manager.updateData(managerModules);
  return manager;
}

function initializeResizeListener() {
  const listener = resizeEventListener();
  listener.addResizeListener(document.body, () => {
    if (document.body) {
      dispatch({
        type: 'resize',
        height: document.body.getBoundingClientRect().height,
      });
    }
  });
  initializedResizeListener = true;
}
inject();

async function compile({
  sandboxId,
  modules,
  externalResources,
  hasActions,
  isModuleView = false,
  template,
  entry,
}) {
  const startTime = Date.now();
  try {
    clearErrorTransformers();
    initializeErrorTransformers();
    unmount(!hadError);
  } catch (e) {
    console.error(e);
  }
  hadError = false;

  actionsEnabled = hasActions;
  handleExternalResources(externalResources);

  try {
    const templateDefinition = getDefinition(template);
    const configurations = parseConfigurations(
      template,
      templateDefinition.configurationFiles,
      path => modules[path]
    );

    const errors = Object.keys(configurations)
      .map(c => configurations[c])
      .filter(x => x.error);

    if (errors.length) {
      throw new Error(
        `We weren't able to parse: '${errors[0].path}': ${
          errors[0].error.message
        }`
      );
    }

    const packageJSON = modules['/package.json'];

    if (!packageJSON) {
      throw new Error('Could not find package.json');
    }

    const parsedPackageJSON = configurations.package.parsed;

    const dependencies = getDependencies(parsedPackageJSON);
    const { manifest, isNewCombination } = await loadDependencies(dependencies);

    if (isNewCombination && !firstLoad) {
      // Just reset the whole manager if it's a new combination
      manager = null;
    }
    const t = Date.now();

    await updateManager(
      sandboxId,
      template,
      modules,
      manifest,
      configurations,
      isNewCombination
    );

    const possibleEntries = templateDefinition.getEntries(configurations);

    const foundMain = isModuleView
      ? entry
      : possibleEntries.find(p => modules[p]);

    if (!foundMain) {
      throw new Error(
        `Could not find entry file: ${
          possibleEntries[0]
        }. You can specify one in package.json by defining a \`main\` property.`
      );
    }

    const main = absolute(foundMain);
    const managerModuleToTranspile = modules[main];

    await manager.preset.setup(manager);
    await manager.transpileModules(managerModuleToTranspile);

    debug(`Transpilation time ${Date.now() - t}ms`);

    resetScreen();

    if (!manager.webpackHMR) {
      try {
        const children = document.body.children;
        // Do unmounting for react
        if (manifest.dependencies.find(n => n.name === 'react-dom')) {
          const reactDOMModule = manager.resolveModule('react-dom', '');
          const reactDOM = manager.evaluateModule(reactDOMModule);

          reactDOM.unmountComponentAtNode(document.body);

          for (let i = 0; i < children.length; i += 1) {
            if (children[i].tagName === 'DIV') {
              reactDOM.unmountComponentAtNode(children[i]);
            }
          }
        }
      } catch (e) {
        /* don't do anything with this error */
      }
    }
    if (!manager.webpackHMR || firstLoad) {
      const htmlModule =
        modules[
          templateDefinition
            .getHTMLEntries(configurations)
            .find(p => modules[p])
        ];

      const html = htmlModule ? htmlModule.code : '<div id="root"></div>';
      document.body.innerHTML = html;
    }

    const tt = Date.now();
    const oldHTML = document.body.innerHTML;
    const evalled = manager.evaluateModule(managerModuleToTranspile);
    debug(`Evaluation time: ${Date.now() - tt}ms`);
    const domChanged = oldHTML !== document.body.innerHTML;

    if (
      isModuleView &&
      !domChanged &&
      !managerModuleToTranspile.path.endsWith('.html')
    ) {
      const isReact =
        managerModuleToTranspile.code &&
        managerModuleToTranspile.code.includes('React');

      if (isReact) {
        // initiate boilerplates
        if (getBoilerplates().length === 0) {
          try {
            await evalBoilerplates(defaultBoilerplates);
          } catch (e) {
            console.log("Couldn't load all boilerplates");
          }
        }

        const boilerplate = findBoilerplate(managerModuleToTranspile);
        if (boilerplate) {
          try {
            boilerplate.module.default(evalled);
          } catch (e) {
            console.error(e);
          }
        }
      }
    }

    await manager.preset.teardown(manager);

    if (!initializedResizeListener) {
      initializeResizeListener();
    }

    try {
      // Testing
      const ttt = Date.now();
      const testRunner = manager.testRunner;
      testRunner.findTests(modules);
      await testRunner.runTests();
      debug(`Test Evaluation time: ${Date.now() - ttt}ms`);

      // End - Testing
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error(error);
      }
    }

    debug(`Total time: ${Date.now() - startTime}ms`);

    dispatch({
      type: 'success',
    });

    manager.save();
  } catch (e) {
    console.log('Error in sandbox:');
    console.error(e);

    if (manager) {
      manager.clearCache();
    }

    e.module = e.module;
    e.fileName = e.fileName;

    const event = new Event('error');
    event.error = e;

    window.dispatchEvent(event);

    hadError = true;
  }
  firstLoad = false;

  if (typeof window.__puppeteer__ === 'function') {
    window.__puppeteer__('done');
  }
}

type Arguments = {
  sandboxId: string,
  modules: Array<{
    code: string,
    path: string,
  }>,
  entry: ?string,
  externalResources: Array<string>,
  hasActions: boolean,
  template: string,
};

const tasks: Array<Arguments> = [];
let runningTask = false;

async function executeTaskIfAvailable() {
  if (tasks.length) {
    const task = tasks.pop();

    runningTask = true;
    await compile(task);
    runningTask = false;

    executeTaskIfAvailable();
  }
}

/**
 * We want to ensure that no tasks (commands from the editor) are run in parallel,
 * this could result in state inconsistency. That's why we execute tasks after eachother,
 * and if there are 3 tasks we will remove the second task, this one is unnecessary as it is not the
 * latest version.
 */
export default function queueTask(data: Arguments) {
  tasks[0] = data;

  if (!runningTask) {
    executeTaskIfAvailable();
  }
}
