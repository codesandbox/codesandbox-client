import React from 'react';
import { useImageBrightness, Brightness } from './useImageBrightness';

const useImageLoaded = (url?: string) => {
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

const SCREENSHOT_TIMEOUT = 5000;

type SandboxThumbnail =
  | {
      isLoaded: boolean;
      src: string;
      isCustom: false;
      brightness: undefined;
    }
  | {
      isLoaded: boolean;
      src: string;
      isCustom: true;
      brightness: Brightness;
    };

// 1. Use sandbox.screenshotUrl with brightness when the thumbnail is custom
// 2. Use sandbox.screenshotUrl if it can be successfully loaded (might not exist)
// 3. If screenshot is outdated, lazily load a newer screenshot. Switch when image loaded.
export const useSandboxThumbnail = ({
  sandboxId,
  screenshotUrl, // TODO: rename to thumbnailUrl for hook?
  screenshotOutdated,
}): SandboxThumbnail | undefined => {
  const isCustom = screenshotUrl?.includes('uploads');

  // Image brightness is only relevant when the screenshot is custom.
  const thumbnailBrightness = useImageBrightness(
    isCustom ? screenshotUrl : undefined
  );

  // Only useImageLoaded for the screenshot url when it hasn't been loaded by the
  // useImageBrightness hook yet.
  const screenshotUrlLoaded = useImageLoaded(
    thumbnailBrightness.isLoaded ? undefined : screenshotUrl
  );

  const [latestScreenshotUrl, setLatestScreenshotUrl] = React.useState<
    string | undefined
  >(undefined);

  const latestScreenshotUrlLoaded = useImageLoaded(latestScreenshotUrl);

  React.useEffect(
    function lazyLoadLatestScreenshot() {
      const timer = window.setTimeout(() => {
        if (!screenshotOutdated || isCustom) return;
        const url = `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/screenshot.png`;
        setLatestScreenshotUrl(url);
      }, SCREENSHOT_TIMEOUT);

      return () => window.clearTimeout(timer);
    },
    [sandboxId, screenshotOutdated, isCustom, setLatestScreenshotUrl]
  );

  let isLoaded: boolean = false;
  let src: string;

  if (thumbnailBrightness.isLoaded || screenshotUrlLoaded) {
    src = screenshotUrl;
    isLoaded = true;
  }

  // Only true if there is a latest screenshot and no custom thumbnail. In that
  // case we should show the latest screenshot.
  if (latestScreenshotUrlLoaded) {
    src = latestScreenshotUrl;
    isLoaded = true;
  }

  return {
    isLoaded,
    src,
    isCustom,
    brightness: thumbnailBrightness.brightness,
  };
};
