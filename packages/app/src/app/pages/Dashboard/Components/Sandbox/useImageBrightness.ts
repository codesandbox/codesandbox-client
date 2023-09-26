import { useState, useEffect } from 'react';

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();

    img.addEventListener('load', () => {
      resolve(img);
    });

    img.addEventListener('error', () => {
      reject(new Error(`Failed to load image URL: ${src}`));
    });

    img.crossOrigin = 'Anonymous';
    img.src = src;
  });
}

function shrinkSizeToMax({ width, height }: HTMLImageElement, max: number) {
  const ratio = Math.min(max / width, max / height);

  return {
    width: width * ratio,
    height: height * ratio,
  };
}

export type Brightness = 'light' | 'dark';

type ImageBrightness = {
  isLoaded: boolean;
  brightness: Brightness | undefined;
};

export const useImageBrightness = (src?: string): ImageBrightness => {
  const [isLoaded, setLoaded] = useState<boolean>(false);
  const [brightness, setBrightness] = useState<Brightness | undefined>(
    undefined
  );

  useEffect(() => {
    async function calculateBrightness() {
      setLoaded(false);

      try {
        const loadedImage = await loadImage(src);

        // Would love to use OffscreenCanvas but Safari doesn't support it
        const canvas = document.createElement('canvas');

        // Shrink image to < 100 px width or height
        const { width, height } = shrinkSizeToMax(loadedImage, 100);

        // TODO: We can further optimize the imageData loop by making the canvas
        // smaller to only include the top X pixels of the image.
        canvas.width = width;
        canvas.height = height;

        // TODO: try / catch getContext and drawImage and getImageData (i think just drawImage
        // because I've had problems with cross origin stuff)
        const canvasContext = canvas.getContext('2d');

        if (canvasContext) {
          canvasContext.drawImage(loadedImage, 0, 0, width, height);
        }

        const imageData = canvasContext?.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        ).data;

        let colorSum = 0;

        if (imageData) {
          for (let i = 0, length = imageData?.length; i < length; i += 4) {
            const averageColor = Math.floor(
              // (r + g + b) / 3
              (imageData[i] + imageData[i + 1] + imageData[i + 2]) / 3
            );

            // TODO: could include the alpha channel: https://github.com/lokesh/color-thief/blob/ef231c711309dc32be1efa83bd4da7c0ed21cd6e/dist/color-thief.js#L4

            colorSum += averageColor;
          }

          const brightnessValue = Math.floor(colorSum / (width * height));
          const brightnessType = brightnessValue > 225 / 2 ? 'light' : 'dark';

          setBrightness(brightnessType);
          setLoaded(true);
        }
      } catch (e) {
        setBrightness(undefined);
        setLoaded(true);
      }
    }

    // Only calculate brightness when image src is present
    if (src) {
      calculateBrightness();
    }
  }, [src]);

  return {
    isLoaded,
    brightness,
  };
};
