export const MESSAGE_REQUEST = 'codesandbox-sandpack-request';
export const MESSAGE_RESPONSE = 'codesandbox-sandpack-response';
export const MESSAGE_START = 'codesandbox-sandpack-start';

export const PATH_ASSETS_JSON = '/assets.json';

export const PASSTHROUGH_PATHS = ['/', '/index.html', PATH_ASSETS_JSON];

export const REQUEST_FLUSH_DELAY = 5000;
export const REQUEST_FLUSH_INTERVAL = 1000;

export type SandpackRequestPayload = {
  path: string;
  requestId: string;
};

export type SandpackResponsePayload = {
  requestId: string;
  isFile: boolean;
  content?: string;
  contentType?: string;
};

export const createRequestEvent = (payload: SandpackRequestPayload) => ({
  type: MESSAGE_REQUEST,
  payload,
});

export const createResponseEvent = (payload: SandpackResponsePayload) => ({
  type: MESSAGE_RESPONSE,
  payload,
});
