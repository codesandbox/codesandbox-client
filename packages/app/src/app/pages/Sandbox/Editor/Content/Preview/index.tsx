import BasePreview from '@codesandbox/common/lib/components/Preview';
import RunOnClick from '@codesandbox/common/lib/components/RunOnClick';
// @flow
import React, { FC, useState } from 'react';
import { useOvermind } from 'app/overmind';

type Props = {
  hidden?: boolean;
  runOnClick?: boolean;
  options: { url?: string };
};

const PreviewComponent: FC<Props> = props => {
  const { state, actions, effects } = useOvermind();
  const [running, setRunning] = useState(!props.runOnClick);

  /**
   * Responsible for showing a message when something is happening with SSE. Only used
   * for server sandboxes right now, but we can extend it in the future. It would require
   * a better design if we want to use it for more though.
   */
  function getOverlayMessage() {
    const { containerStatus, error, hasUnrecoverableError } = state.server;

    if (containerStatus === 'hibernated') {
      return 'The container has been hibernated because of inactivity, you can start it by refreshing the browser.';
    }

    if (containerStatus === 'stopped') {
      return 'Restarting the sandbox...';
    }

    if (error && hasUnrecoverableError) {
      return 'A sandbox error occurred, you can refresh the page to restart the container.';
    }

    return undefined;
  }

  const { options } = props;

  const completelyHidden = !state.editor.previewWindowVisible;

  return running ? (
    <BasePreview
      onInitialized={effects.preview.initializePreview}
      sandbox={state.editor.currentSandbox}
      privacy={state.editor.currentSandbox.privacy}
      previewSecret={state.editor.currentSandbox.previewSecret}
      currentModule={state.editor.currentModule}
      settings={state.preferences.settings}
      initialPath={state.editor.initialPath}
      url={options.url}
      isInProjectView={state.editor.isInProjectView}
      onClearErrors={() => actions.editor.errorsCleared()}
      onAction={action => actions.editor.previewActionReceived({ action })}
      hide={props.hidden}
      noPreview={completelyHidden}
      onToggleProjectView={() => actions.editor.projectViewToggled()}
      isResizing={state.editor.isResizing}
      overlayMessage={getOverlayMessage()}
    />
  ) : (
    <RunOnClick
      onClick={() => {
        setRunning(true);
      }}
    />
  );
};
export const Preview = PreviewComponent;
