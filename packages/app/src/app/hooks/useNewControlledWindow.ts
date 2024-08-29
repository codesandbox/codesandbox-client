import track from '@codesandbox/common/lib/utils/analytics';
import * as React from 'react';

/**
 * This hook is responsible for checking the visibility of the new window
 * (eg: GitHub App install page), and the current document state
 */
export const useNewControlledWindow = ({
  url,
  trackEvents,
  onCloseWindow,
}: {
  url: string;
  trackEvents?: {
    open: string;
    close: string;
  };
  onCloseWindow?: () => void;
}): {
  currentDocFocused: boolean;
  newWindowOpened: boolean;
  openNewWindow: () => void;
  resetWindowControl: () => void;
} => {
  const popupRef = React.useRef<Window>(null);
  const [state, setState] = React.useState({
    currentDocFocused: false,
    newWindowOpened: false,
  });

  React.useEffect(() => {
    const body = window.document.querySelector('body');
    if (!body) return () => {};

    if (state.newWindowOpened && !state.currentDocFocused) {
      body.style.filter = `grayscale(80%)`;
    } else {
      body.style.filter = ``;
    }

    return () => {
      body.style.filter = ``;
    };
  }, [state]);

  React.useEffect(
    function checkPageState() {
      let refAnimation: number;
      let timeout: NodeJS.Timeout;

      const checkWindowState = () => {
        setState(prev => ({
          ...prev,
          currentDocFocused: document.hasFocus(),
        }));

        if (popupRef.current) {
          if (popupRef.current.closed) {
            if (trackEvents) {
              track(trackEvents.close);
            }

            if (onCloseWindow) {
              onCloseWindow();
            }

            setState(prev => ({
              ...prev,
              newWindowOpened: false,
            }));
          }
        }

        timeout = setTimeout(() => {
          refAnimation = requestAnimationFrame(checkWindowState);
        }, 300);
      };

      // Avoid loop checking if the popup window is not open
      if (!state.newWindowOpened) {
        return () => {};
      }

      checkWindowState();

      return () => {
        clearTimeout(timeout);
        cancelAnimationFrame(refAnimation);
      };
    },
    [state.newWindowOpened]
  );

  return {
    ...state,
    openNewWindow: () => {
      const popupW = 900;
      const popupH = 600;

      const windowRef = window.open(
        url,
        'mywindow',
        `menubar=1,resizable=1,width=${popupW},height=${popupH},top=${
          window.screen.height / 2 - popupH / 2
        },left=${window.screen.width / 2 - popupW / 2}`
      );

      if (trackEvents) {
        track(trackEvents.open);
      }

      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      (popupRef.current as any) = windowRef;
      setState(prev => ({
        ...prev,
        newWindowOpened: true,
      }));
    },
    resetWindowControl: () =>
      setState({
        currentDocFocused: false,
        newWindowOpened: false,
      }),
  };
};
