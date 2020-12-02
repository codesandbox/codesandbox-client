import { dispatch, listen } from 'codesandbox-api';
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
  async getIframeBoundingRect() {
    const preview = await _preview.promise;

    return preview.element.getBoundingClientRect();
  },
  async getPreviewPath() {
    const preview = await _preview.promise;

    let path = preview.state.urlInAddressBar;

    path = path.replace('http://', '').replace('https://', '');

    return path.substr(path.indexOf('/'));
  },
  takeScreenshot(isPrivateSandbox: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      let timeout;
      const start = Date.now();

      const disposeListener = listen((data: any) => {
        if (data.type === 'screenshot-generated') {
          clearTimeout(timeout);
          const waitAtLeastMs = 250;
          const waitedMs = Date.now() - start;

          setTimeout(
            () => resolve(data.screenshot),
            waitedMs > waitAtLeastMs ? 0 : waitAtLeastMs - waitedMs
          );
        }
      });

      timeout = setTimeout(() => {
        disposeListener();
        reject(new Error('Creating screenshot timed out'));
      }, 3000);

      // this dispatch triggers a "screenshot-generated" message
      // which is received inside the PreviewCommentWrapper
      dispatch({
        type: 'take-screenshot',
        data: {
          isPrivateSandbox,
        },
      });
    });
  },
  createScreenshot({
    screenshotSource,
    bubbleSource,
    cropWidth,
    cropHeight,
    x,
    y,
    scale,
  }: {
    screenshotSource: string;
    bubbleSource: string;
    cropWidth: number;
    cropHeight: number;
    x: number;
    y: number;
    scale: number;
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
        const dpr = window.devicePixelRatio || 1;
        const scaledX = (x / scale) * dpr;
        const scaledY = (y / scale) * dpr;
        const scaledHalfCropWidth = (cropWidth / 2) * dpr;
        const scaledHalfCropHeight = (cropHeight / 2) * dpr;

        const rightSideSpace = Math.min(
          screenshot.width - scaledX,
          scaledHalfCropWidth
        );
        const bottomSideSpace = Math.min(
          screenshot.height - scaledY,
          scaledHalfCropHeight
        );
        const leftSideSpace = Math.min(scaledX, scaledHalfCropWidth);
        const topSideSpace = Math.min(scaledY, scaledHalfCropHeight);

        // Make sure we don't make our canvas bigger than our screenshot can fill
        const width = Math.min(
          leftSideSpace + rightSideSpace,
          screenshot.width
        );
        const height = Math.min(
          bottomSideSpace + topSideSpace,
          screenshot.height
        );

        // Offset the screenshot enough to show the comment bubble, but not more
        // than possible before we end up with transparent pixels
        const sx = Math.min(scaledX - leftSideSpace, screenshot.width - width);
        const sy = Math.min(scaledY - topSideSpace, screenshot.height - height);

        const bubbleX = PREVIEW_COMMENT_BUBBLE_OFFSET + scaledX - sx;
        const bubbleY = PREVIEW_COMMENT_BUBBLE_OFFSET + scaledY - sy;

        canvas.width = width + PREVIEW_COMMENT_BUBBLE_OFFSET * 2;
        canvas.height = height + PREVIEW_COMMENT_BUBBLE_OFFSET * 2;

        const radius = 5;

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
        ctx.drawImage(bubble, bubbleX, bubbleY);

        return canvas.toDataURL();
      }
    );
  },
};
