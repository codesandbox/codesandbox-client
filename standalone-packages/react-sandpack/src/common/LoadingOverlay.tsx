import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { OpenInCodeSandboxButton } from './OpenInCodeSandboxButton';
import { useLoadingOverlayState } from '../hooks/useLoadingOverlayState';

export const LoadingOverlay = () => {
  const loadingOverlayState = useLoadingOverlayState();
  const c = useClasser('sp');

  if (loadingOverlayState === 'hidden') {
    return null;
  }

  return (
    <div
      className={c('overlay', 'loading')}
      style={{
        opacity: loadingOverlayState === 'visible' ? 1 : 0,
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <div className="sp-cube-wrapper" title="Open in CodeSandbox">
        <OpenInCodeSandboxButton />
        <div className="sp-cube">
          <div className="sp-sides">
            <div className="sp-top" />
            <div className="sp-right" />
            <div className="sp-bottom" />
            <div className="sp-left" />
            <div className="sp-front" />
            <div className="sp-back" />
          </div>
        </div>
      </div>
    </div>
  );
};
