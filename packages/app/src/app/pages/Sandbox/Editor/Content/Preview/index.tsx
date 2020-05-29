import BasePreview from '@codesandbox/common/es/components/Preview';
import RunOnClick from '@codesandbox/common/es/components/RunOnClick';
import { ServerContainerStatus } from '@codesandbox/common/es/types';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent, useState } from 'react';

type Props = {
  hidden?: boolean;
  options: {
    url?: string;
  };
  runOnClick?: boolean;
};
export const Preview: FunctionComponent<Props> = ({
  hidden,
  options,
  runOnClick,
}) => {
  const {
    actions: {
      editor: { errorsCleared, previewActionReceived, projectViewToggled },
    },
    effects: {
      preview: { initializePreview },
    },
    state: {
      editor: {
        currentModule,
        currentSandbox,
        initialPath,
        isInProjectView,
        isResizing,
        previewWindowVisible,
      },
      preferences: { settings },
      server: { containerStatus, error, hasUnrecoverableError },
    },
  } = useOvermind();
  const [running, setRunning] = useState(!runOnClick);

  /**
   * Responsible for showing a message when something is happening with SSE. Only used
   * for server sandboxes right now, but we can extend it in the future. It would require
   * a better design if we want to use it for more though.
   */
  const getOverlayMessage = () => {
    if (containerStatus === ServerContainerStatus.HIBERNATED) {
      return 'The container has been hibernated because of inactivity, you can start it by refreshing the browser.';
    }

    if (containerStatus === ServerContainerStatus.STOPPED) {
      return 'Restarting the sandbox...';
    }

    if (error && hasUnrecoverableError) {
      return 'A sandbox error occurred, you can refresh the page to restart the container.';
    }

    return undefined;
  };

  return running ? (
    <BasePreview
      currentModule={currentModule}
      hide={hidden}
      initialPath={initialPath}
      isInProjectView={isInProjectView}
      isResizing={isResizing}
      onAction={action => previewActionReceived(action)}
      onClearErrors={() => errorsCleared()}
      onMount={initializePreview}
      noPreview={!previewWindowVisible}
      onToggleProjectView={() => projectViewToggled()}
      overlayMessage={getOverlayMessage()}
      previewSecret={currentSandbox.previewSecret}
      privacy={currentSandbox.privacy}
      sandbox={currentSandbox}
      settings={settings}
      url={options.url}
    />
  ) : (
    <RunOnClick onClick={() => setRunning(true)} />
  );
};
