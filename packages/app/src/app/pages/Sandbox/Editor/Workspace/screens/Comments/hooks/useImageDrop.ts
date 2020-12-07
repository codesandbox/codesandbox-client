import * as React from 'react';

const MAX_IMAGE_WIDTH = 1280;

// Converts file to a maxium size of base64
const toBase64 = (file: File) =>
  new Promise<{ src: string; resolution: [number, number] }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const image = new Image();
        image.onload = function () {
          const minWidth = Math.min(image.width, MAX_IMAGE_WIDTH);
          const resolution = [
            minWidth,
            (minWidth * image.height) / image.width,
          ] as [number, number];
          ctx.drawImage(image, 0, 0, resolution[0], resolution[1]);
          resolve({ src: canvas.toDataURL(), resolution });
        };
        image.src = reader.result as string;
      };
      reader.onerror = reject;
    }
  );

export const useImageDrop = ({
  ref,
  value,
  setValue,
  onDrop,
}: {
  ref: React.MutableRefObject<HTMLTextAreaElement>;
  value: string;
  setValue: (newValue: string) => void;
  onDrop: (name: string, src: string, resolution: [number, number]) => void;
}) => {
  React.useEffect(() => {
    if (ref.current) {
      const onDropListener = (event: DragEvent) => {
        const file = event.dataTransfer.files[0];

        if (file && file.type.startsWith('image/')) {
          const fileName = file.name.replace(/\s/g, '_');
          toBase64(file)
            .then(({ src, resolution }) => {
              const currentCaretIndex = ref.current.selectionStart;
              try {
                const leadingValue = value.substr(0, currentCaretIndex);
                const tailingValue = value.substr(currentCaretIndex);
                const imageRef = `![${fileName}](${fileName})`;
                const newValue = `${leadingValue}${imageRef}${tailingValue}`;

                setValue(newValue);
                onDrop(fileName, src, resolution);

                // We can not update cursor position until React has actually
                // updated the textarea
                setTimeout(() => {
                  ref.current.selectionEnd =
                    currentCaretIndex + imageRef.length;
                });
              } catch {
                // Unmounted
              }
            })
            .catch(() => {
              // ?
            });
        }
      };
      ref.current.addEventListener('drop', onDropListener);

      return () => {
        ref.current.removeEventListener('drop', onDropListener);
      };
    }

    return () => {};
  }, [ref.current, value]);
};
