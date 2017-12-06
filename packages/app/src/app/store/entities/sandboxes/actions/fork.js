// @flow
import { values } from 'lodash';

import { push } from 'react-router-redux';

import { sandboxUrl } from 'common/utils/url-generator';

import { createAPIActions, doRequest } from '../../../api/actions';
import { singleSandboxSelector } from '../selectors';
import { modulesSelector } from '../modules/selectors';
import { normalizeResult } from '../../actions';
import moduleActions from '../modules/actions';
import sandboxEntity from '../entity';
import notificationActions from '../../../notifications/actions';

export const FORK_SANDBOX_API_ACTIONS = createAPIActions('SANDBOX', 'FORK');

export const forkSandbox = (id: string) => async (
  dispatch: Function,
  getState: Function
) => {
  const { data } = await dispatch(
    doRequest(FORK_SANDBOX_API_ACTIONS, `sandboxes/${id}/fork`, {
      method: 'POST',
    })
  );

  const currentSandbox = singleSandboxSelector(getState(), { id });
  if (currentSandbox) {
    const currentModule = modulesSelector(getState())[
      currentSandbox.currentModule
    ];
    if (currentModule) {
      const equivalentModule = data.modules.find(
        m => m.shortid === currentModule.shortid && m.sourceId === data.sourceId
      );
      if (equivalentModule) {
        data.currentModule = equivalentModule.id;
      }
    }
  }
  data.forked = true;

  // Save the unsaved modules
  const oldModules = currentSandbox.modules.map(
    x => modulesSelector(getState())[x]
  );
  await dispatch(normalizeResult(sandboxEntity, data));

  const modules = values(modulesSelector(getState()));
  // Set the code for the new modules from the old modules
  oldModules.filter(m => m.isNotSynced).forEach(m => {
    // Mark old modules as synced so there is no confirm when moving to new url
    dispatch(moduleActions.setModuleSynced(m.id));

    const newModule =
      modules.find(
        m2 => m2.shortid === m.shortid && m2.sourceId === data.sourceId
      ) || m;
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
  getState: Function
) => {
  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  if (sandbox.owned) {
    // We own the sandbox, so return the id and don't fork
    return sandbox.id;
  }

  const forkedSandbox = await dispatch(forkSandbox(sandbox.id));

  return forkedSandbox.id;
};
