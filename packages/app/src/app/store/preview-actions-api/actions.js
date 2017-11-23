// This executes all actions that are requested by the preview
import resolveModule from 'common/sandbox/resolve-module';
import _debug from 'debug';

import notifActions from '../notifications/actions';
import moduleActions from '../entities/sandboxes/modules/actions';
import sandboxActions from '../entities/sandboxes/actions';
import { modulesFromSandboxSelector } from '../entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from '../entities/sandboxes/directories/selectors';
import { singleSandboxSelector } from '../entities/sandboxes/selectors';

const debug = _debug('cs:preview-api');

function getModule(sandboxId: string, path: string, getState: Function) {
  const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
  const modules = modulesFromSandboxSelector(getState(), { sandbox });
  const directories = directoriesFromSandboxSelector(getState(), {
    sandbox,
  });

  try {
    return resolveModule(path.replace(/^\//, ''), modules, directories);
  } catch (e) {
    return null;
  }
}

export default {
  executeAction: action => async (dispatch: Function, getState: Function) => {
    debug('Received new preview action', action);
    switch (action.action) {
      case 'notification': {
        const { title, timeAlive, notificationType } = action;
        return dispatch(
          notifActions.addNotification(title, notificationType, timeAlive)
        );
      }
      case 'show-error': {
        const { sandboxId, path } = action;

        const module = getModule(sandboxId, path, getState);
        if (module) {
          return dispatch(moduleActions.setError(module.id, action));
        }
        return null;
      }
      case 'show-correction': {
        const { sandboxId, path } = action;

        const module = getModule(sandboxId, path, getState);
        if (module) {
          return dispatch(moduleActions.addCorrection(module.id, action));
        }
        return null;
      }
      case 'source.module.rename': {
        const { sandboxId, path, title } = action;

        const module = getModule(sandboxId, path, getState);
        if (module) {
          return dispatch(
            sandboxActions.renameModule(sandboxId, module.id, title)
          );
        }
        return null;
      }
      case 'source.dependencies.add': {
        const { sandboxId, dependency } = action;
        await dispatch(sandboxActions.addNPMDependency(sandboxId, dependency));
        return dispatch(sandboxActions.forceRender(sandboxId));
      }
      case 'editor.open-module': {
        const { sandboxId, path } = action;

        const module = getModule(sandboxId, path, getState);
        if (module) {
          // TODO functionality to open specific lineNumber
          return dispatch(
            sandboxActions.setCurrentModule(sandboxId, module.id)
          );
        }
        return null;
      }
      default:
        return null;
    }
  },
};
