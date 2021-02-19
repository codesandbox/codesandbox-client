import * as React from 'react';

export const LoadingAnimation = ({
  loadingOverlayState,
}: {
  loadingOverlayState: 'visible' | 'fading' | 'hidden';
}) => {
  if (loadingOverlayState === 'hidden') {
    return null;
  }

  return (
    <div
      className="sp-overlay sp-loading"
      style={{
        opacity: loadingOverlayState === 'visible' ? 1 : 0,
        transition: 'opacity 0.3s ease-out',
      }}
    >
      <div className="sp-cubes">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  );
};
