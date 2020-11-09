import { dispatch } from 'codesandbox-api';
import BasePreview from '@codesandbox/common/lib/components/Preview';
import { blocker } from 'app/utils/blocker';

let _preview = blocker<BasePreview>();

const PREVIEW_COMMENT_BUBBLE_OFFSET = 16;

export default {
  initialize() {},
  initializePreview(preview: any) {
    _preview.resolve(preview);
    return () => {
      _preview = blocker<any>();
    };
  },
  async executeCodeImmediately({
    initialRender = false,
    showFullScreen = false,
  } = {}) {
    const preview = await _preview.promise;
    preview.executeCodeImmediately(initialRender, showFullScreen);
  },
  async executeCode() {
    const preview = await _preview.promise;
    preview.executeCode();
  },
  async refresh() {
    const preview = await _preview.promise;
    preview.handleRefresh();
  },
  async updateAddressbarUrl() {
    const preview = await _preview.promise;
    preview.updateAddressbarUrl();
  },
  async getIframBoundingRect() {
    const preview = await _preview.promise;

    return preview.element.getBoundingClientRect();
  },
  async getPreviewPath() {
    const preview = await _preview.promise;

    let path = preview.state.urlInAddressBar;

    path = path.replace('http://', '').replace('https://', '');

    return path.substr(path.indexOf('/'));
  },
  takeScreenshot(isPrivateSandbox: boolean) {
    // this dispatch triggers a "screenshot-generated" message
    // which is received inside the PreviewCommentWrapper
    dispatch({
      type: 'take-screenshot',
      data: {
        isPrivateSandbox
      }
    });
  },
  createScreenshot({
    screenshotSource,
    bubbleSource,
    cropWidth,
    cropHeight,
    x,
    y,
  }: {
    screenshotSource: string;
    bubbleSource: string;
    cropWidth: number;
    cropHeight: number;
    x: number;
    y: number;
  }): Promise<string> {
    const screenshotResolver = new Promise<HTMLImageElement>(resolve => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = screenshotSource;
    });

    const bubbleResolver = new Promise<HTMLImageElement>(resolve => {
      const image = new Image();
      image.onload = () => {
        resolve(image);
      };
      image.src = bubbleSource;
    });

    return Promise.all([screenshotResolver, bubbleResolver]).then(
      ([screenshot, bubble]) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        let spaceWeWantToUseWidth = cropWidth;
        let spaceWeWantToUseHeight = cropHeight;

        const rightSideSpace = Math.min(screenshot.width - x, cropWidth / 2);
        const bottomSideSpace = Math.min(screenshot.height - y, cropHeight / 2);
        const leftSideSpace = Math.min(x, cropWidth / 2);
        const topSideSpace = Math.min(y, cropHeight / 2);

        const width = leftSideSpace + rightSideSpace;
        const height = bottomSideSpace + topSideSpace;
        const sx = x - leftSideSpace;
        const sy = y - topSideSpace;

        canvas.width = width + PREVIEW_COMMENT_BUBBLE_OFFSET * 2;
        canvas.height = height + PREVIEW_COMMENT_BUBBLE_OFFSET * 2;

        const radius = 5;

        // console.log(width, spaceWeWantToUseWidth, sx, x)

        ctx.beginPath();
        ctx.moveTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + radius,
          PREVIEW_COMMENT_BUBBLE_OFFSET
        );
        ctx.lineTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + width - radius,
          PREVIEW_COMMENT_BUBBLE_OFFSET
        );
        ctx.quadraticCurveTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + width,
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET + width,
          PREVIEW_COMMENT_BUBBLE_OFFSET + radius
        );
        ctx.lineTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + width,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height - radius
        );
        ctx.quadraticCurveTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + width,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height,
          PREVIEW_COMMENT_BUBBLE_OFFSET + width - radius,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height
        );
        ctx.lineTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET + radius,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height
        );
        ctx.quadraticCurveTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height,
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET + height - radius
        );
        ctx.lineTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET + radius
        );
        ctx.quadraticCurveTo(
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET + radius,
          PREVIEW_COMMENT_BUBBLE_OFFSET
        );
        ctx.closePath();
        ctx.save();
        ctx.clip();
        ctx.drawImage(
          screenshot,
          sx,
          sy,
          width,
          height,
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          PREVIEW_COMMENT_BUBBLE_OFFSET,
          width,
          height
        );
        ctx.restore();
        ctx.drawImage(
          bubble,
          PREVIEW_COMMENT_BUBBLE_OFFSET + x - sx,
          PREVIEW_COMMENT_BUBBLE_OFFSET + y - sy
        );

        return canvas.toDataURL();
      }
    );
  },
};
