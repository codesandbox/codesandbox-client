import { useImageBrightness, Brightness } from './useImageBrightness';

type SandboxThumbnail = {
  isLoaded: boolean;
  src: string | undefined;
  isCustom: boolean;
  brightness: Brightness;
};

// 1. Use sandbox.screenshotUrl with brightness when the thumbnail is custom
// 2. Don't use a thumbnail when the screenshot isn't custom
export const useSandboxThumbnail = ({
  thumbnailUrl,
}): SandboxThumbnail | undefined => {
  const isCustom = thumbnailUrl?.includes('uploads');

  // Image brightness is only relevant when the thumbnail is custom since
  // we don't use generated screenshots anymore
  const thumbnailBrightness = useImageBrightness(
    isCustom ? thumbnailUrl : undefined
  );

  let src: string;

  if (thumbnailBrightness.isLoaded) {
    src = thumbnailUrl;
  }

  return {
    isLoaded: thumbnailBrightness.isLoaded,
    src,
    isCustom,
    brightness: thumbnailBrightness.brightness,
  };
};
