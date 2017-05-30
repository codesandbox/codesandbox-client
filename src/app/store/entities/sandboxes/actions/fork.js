// @flow
import { values } from 'lodash';

import { push } from 'react-router-redux';

import type { Module, Directory } from 'common/types';
import { sandboxUrl } from 'app/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';
import { singleSandboxSelector } from '../selectors';
import { modulesSelector } from '../modules/selectors';
import { normalizeResult } from '../../actions';
import moduleActions from '../modules/actions';
import sandboxEntity from '../entity';
import notificationActions from '../../../notifications/actions';

export const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');

/**
 * When you fork you get a 'copy' of the modules, these modules have the shortid
 * in common, so if we want to get the module that is equivalent we want to use
 * this
 */
export const getEquivalentModule = (module: Module, modules: Array<Module>) => {
  const newModule = modules.find(
    m => m.id !== module.id && m.shortid === module.shortid,
  );

  return newModule;
};

/**
 * When you fork you get a 'copy' of the directories, these directories have the shortid
 * in common, so if we want to get the directory that is equivalent we want to use
 * this
 */
export const getEquivalentDirectory = (
  directory: Directory,
  directories: Array<Directory>,
) => {
  const newDirectory = directories.find(
    d => d.id !== directory.id && d.shortid === directory.shortid,
  );

  return newDirectory;
};

export const forkSandbox = (id: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  const { data } = await dispatch(
    doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
      method: 'POST',
    }),
  );

  const currentSandbox = singleSandboxSelector(getState(), { id });
  if (currentSandbox) {
    data.currentModule = currentSandbox.currentModule;
  }
  data.forked = true;

  // Save the unsaved modules
  const oldModules = currentSandbox.modules.map(
    x => modulesSelector(getState())[x],
  );
  await dispatch(normalizeResult(sandboxEntity, data));

  const modules = values(modulesSelector(getState()));
  // Set the code for the new modules from the old modules
  oldModules.filter(m => m.isNotSynced).forEach(m => {
    // Mark old modules as synced so there is no confirm when moving to new url
    dispatch(moduleActions.setModuleSynced(m.id));

    const newModule = getEquivalentModule(m, modules) || m;
    dispatch(moduleActions.setCode(newModule.id, m.code));
  });

  dispatch(push(sandboxUrl(data)));

  dispatch(notificationActions.addNotification('Forked sandbox!', 'success'));

  return data;
};

/**
 * Will fork the sandbox if the sandbox is not owned
 * @param {string} sandboxId
 */
export const maybeForkSandbox = (sandboxId: string) => async (
  dispatch: Function,
  getState: Function,
) => {
  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  if (sandbox.owned) {
    // We own the sandbox, so return the id and don't fork
    return sandbox.id;
  }

  const forkedSandbox = await dispatch(forkSandbox(sandbox.id));

  return forkedSandbox.id;
};
