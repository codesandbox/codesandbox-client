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
        transition: 'opacity 0.5s ease-out',
      }}
    >
      <div className="sp-cube-wrapper">
        <div className="sp-cube">
          <div className="sides">
            <div className="top" />
            <div className="right" />
            <div className="bottom" />
            <div className="left" />
            <div className="front" />
            <div className="back" />
          </div>
        </div>
      </div>
    </div>
  );
};
