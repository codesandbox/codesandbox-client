// This executes all actions that are requested by the preview

import notifActions from '../notifications/actions';
import moduleActions from '../entities/sandboxes/modules/actions';
import sandboxActions from '../entities/sandboxes/actions';

export default {
  executeAction: action => async (dispatch: Function) => {
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
        const { sandboxId, moduleId, title } = action;
        return dispatch(
          sandboxActions.renameModule(sandboxId, moduleId, title)
        );
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
