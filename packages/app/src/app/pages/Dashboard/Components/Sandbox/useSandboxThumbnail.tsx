import React from 'react';

const useImageLoaded = (url: string) => {
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    const img = new Image();

    if (url) {
      img.onload = () => {
        setLoaded(true);
      };

      img.src = url;

      if (img.complete) {
        setLoaded(true);
      }
    }

    return function cleanup() {
      img.src = '';
    };
  }, [url]);

  return loaded;
};

export const useSandboxThumbnail = ({
  sandboxId,
  screenshotUrl,
  screenshotOutdated,
}): string | undefined => {
  // 0. Use template icon as starting point and fallback
  // 1. se sandbox.screenshotUrl if it can be successfully loaded (might not exist)
  // 2. If screenshot is outdated, lazily load a newer screenshot. Switch when image loaded.
  const SCREENSHOT_TIMEOUT = 5000;

  const [latestScreenshotUrl, setLatestScreenshotUrl] = React.useState(null);

  const screenshotUrlLoaded = useImageLoaded(screenshotUrl);
  const latestScreenshotUrlLoaded = useImageLoaded(latestScreenshotUrl);

  let screenshotToUse: string;
  if (latestScreenshotUrlLoaded) screenshotToUse = latestScreenshotUrl;
  else if (screenshotUrlLoaded) screenshotToUse = screenshotUrl;

  React.useEffect(
    function lazyLoadLatestScreenshot() {
      const timer = window.setTimeout(() => {
        if (!screenshotOutdated) return;
        const url = `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/screenshot.png`;
        setLatestScreenshotUrl(url);
      }, SCREENSHOT_TIMEOUT);

      return () => window.clearTimeout(timer);
    },
    [sandboxId, screenshotOutdated, setLatestScreenshotUrl]
  );

  return screenshotToUse;
};
