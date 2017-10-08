// This executes all actions that are requested by the preview
import resolveModule from 'common/sandbox/resolve-module';

import notifActions from '../notifications/actions';
import moduleActions from '../entities/sandboxes/modules/actions';
import sandboxActions from '../entities/sandboxes/actions';
import { modulesFromSandboxSelector } from '../entities/sandboxes/modules/selectors';
import { directoriesFromSandboxSelector } from '../entities/sandboxes/directories/selectors';
import { singleSandboxSelector } from '../entities/sandboxes/selectors';

export default {
  executeAction: action => async (dispatch: Function, getState: Function) => {
    switch (action.action) {
      case 'notification': {
        const { title, timeAlive, notificationType } = action;
        return dispatch(
          notifActions.addNotification(title, notificationType, timeAlive)
        );
      }
      case 'show-error': {
        return dispatch(moduleActions.setError(action.moduleId, action));
      }
      case 'show-correction': {
        return dispatch(moduleActions.addCorrection(action.moduleId, action));
      }
      case 'source.module.rename': {
        const { sandboxId, path, title } = action;

        const sandbox = singleSandboxSelector(getState(), { id: sandboxId });
        const modules = modulesFromSandboxSelector(getState(), { sandbox });
        const directories = directoriesFromSandboxSelector(getState(), {
          sandbox,
        });

        const module = resolveModule(path, modules, directories);
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
        const { moduleId, sandboxId /* , lineNumber */ } = action;
        // TODO functionality to open specific lineNumber
        return dispatch(sandboxActions.setCurrentModule(sandboxId, moduleId));
      }
      default:
        return null;
    }
  },
};
