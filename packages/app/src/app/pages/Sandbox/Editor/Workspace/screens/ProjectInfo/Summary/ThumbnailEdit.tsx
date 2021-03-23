import React from 'react';
import { useAppState, useActions } from 'app/overmind';
import { Element, Tooltip } from '@codesandbox/components';
import css from '@styled-system/css';

const readDataURL = (file: File): Promise<string | ArrayBuffer> =>
  new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = e => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(file);
  });

type parsedFiles = { [k: string]: { dataURI: string; type: string } };
const getFile = async (file: File): Promise<parsedFiles> => {
  const returnedFiles = {};
  const dataURI = await readDataURL(file);
  // @ts-ignore
  const fileName = file.path || file.name;

  returnedFiles[`thumbnail.${fileName.split('.').pop()}`] = {
    dataURI,
    type: file.type,
  };

  return returnedFiles;
};
export const ThumbnailEdit = () => {
  const {
    files: { thumbnailToBeCropped },
  } = useActions();
  const {
    editor: {
      currentSandbox: { modules },
    },
    workspace: { uploadingThumb },
  } = useAppState();
  const thumbnailExists = modules.find(m => m.path.includes('/thumbnail.'));

  const uploadThumbnail = () => {
    const fileSelector = document.createElement('input');
    fileSelector.setAttribute('type', 'file');
    fileSelector.setAttribute('accept', 'image/png,image/gif,image/jpeg');
    fileSelector.onchange = async event => {
      const target = event.target as HTMLInputElement;
      const file = await getFile(target.files[0]);

      thumbnailToBeCropped({
        file,
      });
    };

    fileSelector.click();
  };

  const getText = () => {
    if (uploadingThumb) {
      return 'Uploading...';
    }
    if (thumbnailExists) {
      return (
        <Element
          css={css({
            position: 'relative',
            maxHeight: '100%',
          })}
        >
          <img
            css={{
              maxWidth: '100%',
              maxHeight: '100%',
              margin: 'auto',
              display: 'block',
            }}
            src={thumbnailExists.code}
            alt="Thumbnail"
          />
          <Element
            css={{
              position: 'absolute',
              background: 'rgba(21,21,21, 0.8)',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
            }}
          >
            <Tooltip label="Replace Thumbnail">
              <button
                type="button"
                onClick={uploadThumbnail}
                css={css({
                  cursor: 'pointer',
                  position: 'absolute',
                  border: 'none',
                  padding: 0,
                  transform: 'translateX(-50%) translateY(-50%)',
                  top: '50%',
                  left: '50%',
                  background: 'transparent',
                  transition: '200ms ease all',
                  ':hover': {
                    borderRadius: '50%',
                    backgroundColor: 'sideBar.background',
                  },
                })}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <mask
                    id="mask0"
                    mask-type="alpha"
                    maskUnits="userSpaceOnUse"
                    x="7"
                    y="8"
                    width="17"
                    height="17"
                  >
                    <rect
                      x="7.70972"
                      y="8.28076"
                      width="15.8779"
                      height="16"
                      fill="#C4C4C4"
                    />
                  </mask>
                  <g mask="url(#mask0)">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M21.7164 8.89948C21.3773 8.55777 20.8341 8.55118 20.503 8.88475L19.9037 9.48874L22.3596 11.9636L22.959 11.3596C23.29 11.026 23.2835 10.4786 22.9444 10.1369L21.7164 8.89948ZM21.7603 12.5676L19.3043 10.0927L9.11489 20.3605L7.94537 24.0139L11.5709 22.8354L21.7603 12.5676Z"
                      fill="white"
                    />
                  </g>
                </svg>
              </button>
            </Tooltip>
          </Element>
        </Element>
      );
    }
    return '+ Add thumbnail';
  };
  return (
    <button
      onClick={() => (thumbnailExists ? null : uploadThumbnail())}
      type="button"
      css={css({
        marginTop: 6,
        background: 'transparent',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: 'sideBar.border',
        color: 'mutedForeground',
        height: 103,
        padding: 0,
        outline: 'none',
        cursor: thumbnailExists ? 'auto' : 'pointer',
        overflow: 'hidden',
      })}
      disabled={uploadingThumb}
    >
      {getText()}
    </button>
  );
};
