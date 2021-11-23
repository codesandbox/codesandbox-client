import { ServerContainerStatus } from '@codesandbox/common/lib/types';
import BasePreview from '@codesandbox/common/lib/components/Preview';
import { frameUrl } from '@codesandbox/common/lib/utils/url-generator';
import RunOnClick from '@codesandbox/common/lib/components/RunOnClick';

import React, { FunctionComponent, useState } from 'react';
import { useAppState, useActions, useEffects } from 'app/overmind';

import { ResponsiveWrapper } from './ResponsiveWrapper';
import { InstallExtensionBanner } from './ResponsiveWrapper/InstallExtensionBanner';

type Props = {
  hidden?: boolean;
  options: {
    url?: string;
    port?: number;
  };
  runOnClick?: boolean;
};
export const Preview: FunctionComponent<Props> = ({
  hidden,
  options,
  runOnClick,
}) => {
  const {
    preview: previewActions,
    editor: { errorsCleared, previewActionReceived, projectViewToggled },
  } = useActions();
  const {
    preview,
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
  } = useAppState();
  const {
    preview: { initializePreview, canAddComments },
    browser,
  } = useEffects();
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

  // Only show in chromium browsers
  const showBanner =
    preview.showExtensionBanner && browser.isChromium(navigator.userAgent);

  const content = running ? (
    <BasePreview
      currentModule={currentModule}
      hide={hidden}
      initialPath={initialPath}
      isInProjectView={isInProjectView}
      isResizing={isResizing}
      onAction={previewActionReceived}
      onClearErrors={errorsCleared}
      onMount={initializePreview}
      noPreview={!previewWindowVisible}
      onToggleProjectView={projectViewToggled}
      Wrapper={ResponsiveWrapper}
      isResponsivePreviewResizing={preview.responsive.isResizing}
      isResponsiveModeActive={
        preview.mode === 'responsive' ||
        preview.mode === 'responsive-add-comment'
      }
      isPreviewCommentModeActive={
        preview.mode === 'add-comment' ||
        preview.mode === 'responsive-add-comment'
      }
      toggleResponsiveMode={previewActions.toggleResponsiveMode}
      overlayMessage={getOverlayMessage()}
      previewSecret={currentSandbox.previewSecret}
      privacy={currentSandbox.privacy}
      customNpmRegistries={currentSandbox.npmRegistries}
      sandbox={currentSandbox}
      settings={settings}
      isScreenshotLoading={preview.screenshot.isLoading}
      createPreviewComment={
        canAddComments(currentSandbox) && previewActions.createPreviewComment
      }
      url={
        options.url ||
        (options.port
          ? frameUrl(currentSandbox, undefined, { port: options.port })
          : undefined)
      }
    />
  ) : (
    <RunOnClick onClick={() => setRunning(true)} />
  );

  return (
    <>
      {showBanner ? <InstallExtensionBanner /> : null}
      {content}
    </>
  );
};
