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
