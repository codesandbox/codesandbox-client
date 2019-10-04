// @flow
import React, { useState, useCallback, useEffect } from 'react';
import _property from 'lodash/property';
import _isFunction from 'lodash/isFunction';
import { useOvermind } from 'app/overmind';

import BasePreview from '@codesandbox/common/lib/components/Preview';
import RunOnClick from '@codesandbox/common/lib/components/RunOnClick';
import getTemplate from '@codesandbox/common/lib/templates';

type Props = {
  hidden?: boolean;
  runOnClick?: boolean;
  options: { url?: string };
};

const useForceUpdate = () => {
  const [callback, setCallback] = useState(() => () => {});
  const forceUpdate = useCallback(
    cb => {
      setCallback(() => cb);
    },
    [setCallback]
  );

  useEffect(() => {
    if (_isFunction(callback)) {
      callback();
    }
  }, [callback]);

  return forceUpdate;
};

const PreviewComponent: React.FC<Props> = ({
  hidden,
  runOnClick,
  options: { url },
}) => {
  const [running, setRunning] = useState(!runOnClick);
  const handleRunOnClick = useCallback(() => {
    setRunning(true);
  }, [setRunning]);
  const forceUpdate = useForceUpdate();

  const {
    state: {
      editor: {
        currentSandbox,
        currentModule,
        isInProjectView,
        previewWindowVisible,
        initialPath,
        isResizing,
      },
      preferences: { settings },
      server,
    },
    actions: {
      editor: { errorsCleared, previewActionReceived, projectViewToggled },
    },
    reaction,
  } = useOvermind();
  const { template } = currentSandbox;
  const { livePreviewEnabled, instantPreviewEnabled } = settings;

  const handleErrorsCleared = useCallback(() => errorsCleared(), [
    errorsCleared,
  ]);

  const handleProjectViewToggled = useCallback(() => projectViewToggled(), [
    projectViewToggled,
  ]);

  const handlePreviewAction = useCallback(
    action => previewActionReceived({ action }),
    [previewActionReceived]
  );

  const detectStructureChange = useCallback(
    ({ editor: { currentSandbox: sandbox } }) =>
      String(
        sandbox.modules
          .map(module => module.directoryShortid + module.title)
          .concat(
            sandbox.directories.map(
              directory => directory.directoryShortid + directory.title
            )
          )
      ),
    []
  );

  const handleDependenciesChange = useCallback(preview => {
    preview.handleDependenciesChange();
  }, []);

  const handleCodeChange = useCallback(
    preview => {
      const { isServer } = getTemplate(template);
      if (!isServer && livePreviewEnabled) {
        if (instantPreviewEnabled) {
          preview.executeCodeImmediately();
        } else {
          preview.executeCode();
        }
      }
    },
    [template, livePreviewEnabled, instantPreviewEnabled]
  );

  const handleStructureChange = useCallback(
    preview => {
      if (livePreviewEnabled) {
        if (instantPreviewEnabled) {
          preview.executeCodeImmediately();
        } else {
          preview.executeCode();
        }
      }
    },
    [livePreviewEnabled, instantPreviewEnabled]
  );

  const handleModuleSyncedChange = useCallback(
    (preview, change) => {
      if (change && (template === 'static' || !livePreviewEnabled)) {
        preview.handleRefresh();
      }
    },
    [template, livePreviewEnabled]
  );

  const handleExecuteCode = useCallback(preview => {
    preview.executeCodeImmediately();
  }, []);

  const handleProjectView = useCallback(
    preview => {
      forceUpdate(() => {
        preview.executeCodeImmediately();
      });
    },
    [forceUpdate]
  );

  const handlePreviewInitialized = useCallback(
    preview => {
      const disposeHandleProjectViewChange = reaction(
        _property('editor.isInProjectView'),
        () => handleProjectView(preview)
      );
      const disposeHandleForcedRenders = reaction(
        _property('editor.forceRender'),
        () => handleExecuteCode(preview)
      );
      const disposeHandleExternalResources = reaction(
        _property('editor.currentSandbox.externalResources.length'),
        () => handleExecuteCode(preview)
      );
      const disposeHandleModuleSyncedChange = reaction(
        _property('editor.isAllModulesSynced'),
        change => handleModuleSyncedChange(preview, change)
      );
      const disposeHandleCodeChange = reaction(
        ({ editor: { currentSandbox: _currentSandbox } }) =>
          String(_currentSandbox.modules.map(m => m.code)),
        () => {
          handleCodeChange(preview);
        }
      );
      const disposeHandleModuleChange = reaction(
        _property('editor.currentModule'),
        () => {
          if (!isInProjectView) {
            handleCodeChange(preview);
          }
        }
      );
      const disposeHandleStructureChange = reaction(detectStructureChange, () =>
        handleStructureChange(preview)
      );
      const disposeDependenciesHandler = reaction(
        ({ editor: { currentSandbox: _currentSandbox } }) =>
          _currentSandbox.npmDependencies.keys
            ? _currentSandbox.npmDependencies.keys().length
            : Object.keys(_currentSandbox.npmDependencies),
        () => handleDependenciesChange(preview)
      );

      return () => {
        disposeHandleModuleChange();
        disposeHandleProjectViewChange();
        disposeHandleForcedRenders();
        disposeHandleExternalResources();
        disposeHandleModuleSyncedChange();
        disposeHandleCodeChange();
        disposeHandleStructureChange();
        disposeDependenciesHandler();
      };
    },
    [
      detectStructureChange,
      handleCodeChange,
      handleDependenciesChange,
      handleExecuteCode,
      handleModuleSyncedChange,
      handleProjectView,
      handleStructureChange,
      isInProjectView,
      reaction,
    ]
  );

  const completelyHidden = !previewWindowVisible;

  /**
   * Responsible for showing a message when something is happening with SSE. Only used
   * for server sandboxes right now, but we can extend it in the future. It would require
   * a better design if we want to use it for more though.
   */
  let overlayMessage: string;
  const { containerStatus, error, hasUnrecoverableError } = server;

  if (containerStatus === 'hibernated') {
    overlayMessage =
      'The container has been hibernated because of inactivity, you can start it by refreshing the browser.';
  }

  if (containerStatus === 'stopped') {
    overlayMessage = 'Restarting the sandbox...';
  }

  if (error && hasUnrecoverableError) {
    overlayMessage =
      'A sandbox error occurred, you can refresh the page to restart the container.';
  }

  return running ? (
    <BasePreview
      onInitialized={handlePreviewInitialized}
      sandbox={currentSandbox}
      privacy={currentSandbox.privacy}
      previewSecret={currentSandbox.previewSecret}
      currentModule={currentModule}
      settings={settings}
      initialPath={initialPath}
      url={url}
      isInProjectView={isInProjectView}
      onClearErrors={handleErrorsCleared}
      onAction={handlePreviewAction}
      hide={hidden}
      noPreview={completelyHidden}
      onToggleProjectView={handleProjectViewToggled}
      isResizing={isResizing}
      overlayMessage={overlayMessage}
    />
  ) : (
    <RunOnClick onClick={handleRunOnClick} />
  );
};

export const Preview = PreviewComponent;
