import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { useSandpack } from '../../hooks/useSandpack';
import { Navigator } from '../Navigator';
import { RefreshButton } from './RefreshButton';
import { LoadingOverlay } from '../../common/LoadingOverlay';
import { OpenInCodeSandboxButton } from '../../common/OpenInCodeSandboxButton';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { SandpackStack } from '../../common/Stack';

export type PreviewProps = {
  customStyle?: React.CSSProperties;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  showRefreshButton?: boolean;
  showSandpackErrorOverlay?: boolean;
};

export { RefreshButton };

export const SandpackPreview: React.FC<PreviewProps> = ({
  customStyle,
  showNavigator = false,
  showRefreshButton = true,
  showOpenInCodeSandbox = true,
  showSandpackErrorOverlay = true,
}) => {
  const { sandpack, listen } = useSandpack();

  const { status, iframeRef, errorScreenRegisteredRef } = sandpack;

  const c = useClasser('sp');

  React.useEffect(() => {
    errorScreenRegisteredRef.current = true;

    const unsub = listen((message: any) => {
      if (message.type === 'resize' && iframeRef.current) {
        iframeRef.current.style.height = `${message.height}px`;
      }
    });

    return () => unsub();
  }, []);

  return (
    <SandpackStack
      customStyle={{
        ...customStyle,
        display: status !== 'idle' ? 'flex' : 'none',
      }}
    >
      {showNavigator && <Navigator />}

      <div className={c('preview-container')}>
        <iframe
          className={c('preview-iframe')}
          ref={iframeRef}
          title="Sandpack Preview"
        />
        {showSandpackErrorOverlay && <ErrorOverlay />}

        <div className={c('preview-actions')}>
          {!showNavigator && showRefreshButton && status === 'running' && (
            <RefreshButton />
          )}

          {showOpenInCodeSandbox && <OpenInCodeSandboxButton />}
        </div>

        <LoadingOverlay />
      </div>
    </SandpackStack>
  );
};
