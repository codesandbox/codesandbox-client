import React, { FunctionComponent, useEffect, useRef, useState } from 'react';
import { createGlobalStyle } from 'styled-components';
import { Element, Button, Stack } from '@codesandbox/components';
import { useActions, useAppState } from 'app/overmind';
import Cropper from 'cropperjs';
// @ts-ignore
import CropperCSS from 'cropperjs/dist/cropper.min.css';
import { Alert } from '../Common/Alert';

const GlobalStyle = createGlobalStyle`
  ${CropperCSS}
`;

export const CropThumbnail: FunctionComponent = () => {
  const {
    modalClosed,
    files: { thumbnailUploaded },
  } = useActions();
  const {
    workspace: { activeThumb },
  } = useAppState();
  const [newImage, setNewImage] = useState('');
  const [loading, setLoading] = useState(false);
  const image = useRef();
  const base64 = Object.values(activeThumb)[0].dataURI;

  useEffect(() => {
    if (image.current) {
      const cropper = new Cropper(image.current, {
        aspectRatio: 40 / 21,
        background: false,
        crop() {
          const croppedImage = cropper.getCroppedCanvas();
          const canvasURI = croppedImage.toDataURL();
          setNewImage(canvasURI);
        },
      });
    }
  }, []);

  const setNewThumb = async () => {
    const name = Object.keys(activeThumb)[0];
    const thumb = {
      [name]: {
        ...Object.values(activeThumb)[0],
        dataURI: newImage,
      },
    };
    setLoading(true);
    await thumbnailUploaded({
      file: thumb,
    });
    setLoading(false);
    modalClosed();
  };

  return (
    <Alert title="Crop your sandbox thumbnail">
      <GlobalStyle />
      <Element marginY={6}>
        <img
          src={base64}
          ref={image}
          alt=""
          style={{ maxWidth: '80%', maxHeight: 410, display: 'block' }}
        />
      </Element>
      <Stack justify="flex-end" marginTop={11} gap={2}>
        <Button
          loading={loading}
          disabled={loading}
          autoWidth
          type="submit"
          onClick={setNewThumb}
        >
          Save
        </Button>
      </Stack>
    </Alert>
  );
};
