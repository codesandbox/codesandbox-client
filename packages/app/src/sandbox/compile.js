import { dispatch, reattach, clearErrorTransformers } from 'codesandbox-api';
import { absolute } from 'common/utils/path';
import _debug from 'app/utils/debug';
import parseConfigurations from 'common/templates/configuration/parse';

import initializeErrorTransformers from './errors/transformers';
import getPreset from './eval';
import Manager from './eval/manager';

import { resetScreen } from './status-screen';

import { inject, unmount } from './react-error-overlay/overlay';
import createCodeSandboxOverlay from './codesandbox-overlay';
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

const DEPENDENCY_ALIASES = {
  '@vue/cli-plugin-babel': '@vue/babel-preset-app',
};

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

const BABEL_DEPENDENCIES = [
  'babel-preset-env',
  'babel-preset-latest',
  'babel-preset-es2015',
  'babel-preset-es2015-loose',
  'babel-preset-es2016',
  'babel-preset-es2017',
  'babel-preset-react',
  'babel-preset-stage-0',
  'babel-preset-stage-1',
  'babel-preset-stage-2',
  'babel-preset-stage-3',
];

// Dependencies that we actually don't need, we will replace this by a dynamic
// system in the future
const PREINSTALLED_DEPENDENCIES = [
  'node-lib-browser',
  'babel-runtime',
  'react-scripts',
  'react-scripts-ts',
  'parcel-bundler',
  'babel-plugin-check-es2015-constants',
  'babel-plugin-external-helpers',
  'babel-plugin-inline-replace-variables',
  'babel-plugin-syntax-async-functions',
  'babel-plugin-syntax-async-generators',
  'babel-plugin-syntax-class-constructor-call',
  'babel-plugin-syntax-class-properties',
  'babel-plugin-syntax-decorators',
  'babel-plugin-syntax-do-expressions',
  'babel-plugin-syntax-exponentiation-operator',
  'babel-plugin-syntax-export-extensions',
  'babel-plugin-syntax-flow',
  'babel-plugin-syntax-function-bind',
  'babel-plugin-syntax-function-sent',
  'babel-plugin-syntax-jsx',
  'babel-plugin-syntax-object-rest-spread',
  'babel-plugin-syntax-trailing-function-commas',
  'babel-plugin-transform-async-functions',
  'babel-plugin-transform-async-to-generator',
  'babel-plugin-transform-async-to-module-method',
  'babel-plugin-transform-class-constructor-call',
  'babel-plugin-transform-class-properties',
  'babel-plugin-transform-decorators',
  'babel-plugin-transform-decorators-legacy',
  'babel-plugin-transform-do-expressions',
  'babel-plugin-transform-es2015-arrow-functions',
  'babel-plugin-transform-es2015-block-scoped-functions',
  'babel-plugin-transform-es2015-block-scoping',
  'babel-plugin-transform-es2015-classes',
  'babel-plugin-transform-es2015-computed-properties',
  'babel-plugin-transform-es2015-destructuring',
  'babel-plugin-transform-es2015-duplicate-keys',
  'babel-plugin-transform-es2015-for-of',
  'babel-plugin-transform-es2015-function-name',
  'babel-plugin-transform-es2015-instanceof',
  'babel-plugin-transform-es2015-literals',
  'babel-plugin-transform-es2015-modules-amd',
  'babel-plugin-transform-es2015-modules-commonjs',
  'babel-plugin-transform-es2015-modules-systemjs',
  'babel-plugin-transform-es2015-modules-umd',
  'babel-plugin-transform-es2015-object-super',
  'babel-plugin-transform-es2015-parameters',
  'babel-plugin-transform-es2015-shorthand-properties',
  'babel-plugin-transform-es2015-spread',
  'babel-plugin-transform-es2015-sticky-regex',
  'babel-plugin-transform-es2015-template-literals',
  'babel-plugin-transform-es2015-typeof-symbol',
  'babel-plugin-transform-es2015-unicode-regex',
  'babel-plugin-transform-es3-member-expression-literals',
  'babel-plugin-transform-es3-property-literals',
  'babel-plugin-transform-es5-property-mutators',
  'babel-plugin-transform-eval',
  'babel-plugin-transform-exponentiation-operator',
  'babel-plugin-transform-export-extensions',
  'babel-plugin-transform-flow-comments',
  'babel-plugin-transform-flow-strip-types',
  'babel-plugin-transform-function-bind',
  'babel-plugin-transform-jscript',
  'babel-plugin-transform-object-assign',
  'babel-plugin-transform-object-rest-spread',
  'babel-plugin-transform-object-set-prototype-of-to-assign',
  'babel-plugin-transform-proto-to-assign',
  'babel-plugin-transform-react-constant-elements',
  'babel-plugin-transform-react-display-name',
  'babel-plugin-transform-react-inline-elements',
  'babel-plugin-transform-react-jsx',
  'babel-plugin-transform-react-jsx-compat',
  'babel-plugin-transform-react-jsx-self',
  'babel-plugin-transform-react-jsx-source',
  'babel-plugin-transform-regenerator',
  'babel-plugin-transform-runtime',
  'babel-plugin-transform-strict-mode',
  'babel-plugin-undeclared-variables-check',
  'babel-plugin-dynamic-import-node',
  'babel-plugin-detective',
  'babel-plugin-transform-prevent-infinite-loops',
  'babel-plugin-transform-vue-jsx',
  'babel-plugin-jsx-pragmatic',

  '@babel/core',

  'flow-bin',
];

function getDependencies(parsedPackage, templateDefinition, configurations) {
  const {
    dependencies: d = {},
    peerDependencies = {},
    devDependencies = {},
  } = parsedPackage;

  const returnedDependencies = { ...peerDependencies, ...d };

  const foundWhitelistedDevDependencies = [...WHITELISTED_DEV_DEPENDENCIES];

  // Add all babel plugins/presets to whitelisted dependencies
  if (configurations && configurations.babel && configurations.babel.parsed) {
    (configurations.babel.parsed.presets || [])
      .filter(p => typeof p === 'string')
      .forEach(p => {
        const [first, ...parts] = p.split('/');
        const prefixedName = p.startsWith('@')
          ? first + '/babel-preset-' + parts.join('/')
          : `babel-preset-${p}`;

        foundWhitelistedDevDependencies.push(p);
        foundWhitelistedDevDependencies.push(prefixedName);
      });

    (configurations.babel.parsed.plugins || [])
      .filter(p => typeof p === 'string')
      .forEach(p => {
        const [first, ...parts] = p.split('/');
        const prefixedName = p.startsWith('@')
          ? first + '/babel-plugin-' + parts.join('/')
          : `babel-plugin-${p}`;

        foundWhitelistedDevDependencies.push(p);
        foundWhitelistedDevDependencies.push(prefixedName);
      });
  }

  Object.keys(devDependencies).forEach(dep => {
    const usedDep = DEPENDENCY_ALIASES[dep] || dep;
    if (foundWhitelistedDevDependencies.indexOf(usedDep) > -1) {
      returnedDependencies[usedDep] = devDependencies[dep];
    }
  });

  let preinstalledDependencies = PREINSTALLED_DEPENDENCIES;
  if (templateDefinition.name !== 'babel-repl') {
    preinstalledDependencies = [
      ...preinstalledDependencies,
      ...BABEL_DEPENDENCIES,
    ];
  }

  preinstalledDependencies.forEach(dep => {
    if (returnedDependencies[dep]) {
      delete returnedDependencies[dep];
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
  }

  if (isNewCombination || newManager) {
    manager.setManifest(manifest);
  }

  if (firstLoad && newManager) {
    // We save the state of transpiled modules, and load it here again. Gives
    // faster initial loads.

    await manager.load();
  }

  manager.updateConfigurations(configurations);
  return manager.updateData(managerModules);
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

function overrideDocumentClose() {
  const oldClose = window.document.close;

  window.document.close = function close(...args) {
    try {
      oldClose.call(document, args);
    } catch (e) {
      throw e;
    } finally {
      inject();
      reattach();
    }
  };
}

overrideDocumentClose();

inject();

async function compile({
  sandboxId,
  modules,
  externalResources,
  hasActions,
  isModuleView = false,
  template,
  entry,
  showOpenInCodeSandbox = false,
  skipEval = false,
}) {
  dispatch({
    type: 'start',
  });

  const startTime = Date.now();
  try {
    inject();
    clearErrorTransformers();
    initializeErrorTransformers();
    unmount(manager && manager.webpackHMR ? true : hadError);
  } catch (e) {
    console.error(e);
  }

  hadError = false;

  actionsEnabled = hasActions;
  handleExternalResources(externalResources);

  let managerModuleToTranspile = null;
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
      const e = new Error(
        `We weren't able to parse: '${errors[0].path}': ${
          errors[0].error.message
        }`
      );

      e.fileName = errors[0].path;

      throw e;
    }

    const packageJSON = modules['/package.json'];

    if (!packageJSON) {
      throw new Error('Could not find package.json');
    }

    const parsedPackageJSON = configurations.package.parsed;

    dispatch({ type: 'status', status: 'installing-dependencies' });

    const dependencies = getDependencies(
      parsedPackageJSON,
      templateDefinition,
      configurations
    );
    const { manifest, isNewCombination } = await loadDependencies(dependencies);

    if (isNewCombination && !firstLoad) {
      // Just reset the whole manager if it's a new combination
      if (manager) {
        manager.dispose();
      }
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
    managerModuleToTranspile = modules[main];

    dispatch({ type: 'status', status: 'transpiling' });

    await manager.preset.setup(manager);
    await manager.transpileModules(managerModuleToTranspile);

    debug(`Transpilation time ${Date.now() - t}ms`);

    dispatch({ type: 'status', status: 'evaluating' });

    const managerTranspiledModuleToTranspile = manager.getTranspiledModule(
      managerModuleToTranspile
    );
    if (!skipEval) {
      resetScreen();

      if (
        !manager.webpackHMR &&
        (!managerTranspiledModuleToTranspile.compilation || isModuleView)
      ) {
        try {
          const children = document.body.children;
          // Do unmounting for react
          if (
            manifest &&
            manifest.dependencies.find(n => n.name === 'react-dom')
          ) {
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

          if (process.env.NODE_ENV === 'development') {
            console.error('Problem while cleaning up');
            console.error(e);
          }
        }
      }

      if ((!manager.webpackHMR || firstLoad) && !manager.preset.htmlDisabled) {
        if (!managerTranspiledModuleToTranspile.compilation || isModuleView) {
          const htmlModule =
            modules[
              templateDefinition
                .getHTMLEntries(configurations)
                .find(p => modules[p])
            ];

          const html = htmlModule
            ? htmlModule.code
            : template === 'vue-cli'
              ? '<div id="app"></div>'
              : '<div id="root"></div>';
          document.body.innerHTML = html;
        }
      }

      const tt = Date.now();
      const oldHTML = document.body.innerHTML;
      const evalled = manager.evaluateModule(
        managerModuleToTranspile,
        isModuleView
      );
      debug(`Evaluation time: ${Date.now() - tt}ms`);
      const domChanged =
        !manager.preset.htmlDisabled && oldHTML !== document.body.innerHTML;

      if (
        isModuleView &&
        !domChanged &&
        !managerModuleToTranspile.path.endsWith('.html')
      ) {
        const isReact =
          managerModuleToTranspile.code &&
          managerModuleToTranspile.code.includes('React');

        if (isReact && evalled) {
          // initiate boilerplates
          if (getBoilerplates().length === 0) {
            try {
              await evalBoilerplates(defaultBoilerplates);
            } catch (e) {
              console.log("Couldn't load all boilerplates: " + e.message);
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
    }

    await manager.preset.teardown(manager);

    if (!initializedResizeListener && !manager.preset.htmlDisabled) {
      initializeResizeListener();
    }

    if (showOpenInCodeSandbox) {
      createCodeSandboxOverlay(modules);
    }

    dispatch({ type: 'status', status: 'running-tests' });

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

    if (firstLoad) {
      inject();
    }

    const event = new Event('error');
    event.error = e;

    window.dispatchEvent(event);

    hadError = true;
  } finally {
    if (manager) {
      const managerState = {
        ...manager.serialize(),
      };
      delete managerState.cachedPaths;
      managerState.entry = managerModuleToTranspile
        ? managerModuleToTranspile.path
        : null;

      dispatch({
        type: 'state',
        state: managerState,
      });
    }
  }
  firstLoad = false;

  dispatch({ type: 'status', status: 'idle' });
  dispatch({ type: 'done' });

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
  showOpenInCodeSandbox?: boolean,
  skipEval?: boolean,
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
