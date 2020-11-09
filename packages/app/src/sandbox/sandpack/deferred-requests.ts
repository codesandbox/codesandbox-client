export type DeferredRequest = {
  readonly request: Request;
  readonly resolve: (Response) => void;
  readonly reject: (Error) => void;
};

/**
 * Returns a UUID
 *
 * Lovingly taken from https://stackoverflow.com/a/2117523/1708147
 * Thanks!
 */
const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });

const resolveWithPassthrough = ({
  request,
  resolve,
  reject,
}: DeferredRequest): Promise<Response> =>
  fetch(request)
    .then(res => {
      resolve(res);
      return res;
    })
    .catch(e => {
      reject(e);
      throw e;
    });

const resolveWithResponse = (response: Response) => ({
  resolve,
}: DeferredRequest): Promise<Response> => {
  resolve(response);
  return Promise.resolve(response);
};

export class DeferredRequestsCollection {
  private readonly _requests: Map<string, DeferredRequest>;

  constructor() {
    this._requests = new Map<string, DeferredRequest>();
  }

  create(request: DeferredRequest): string {
    const requestId = this._createRequestId();

    this._requests.set(requestId, request);

    return requestId;
  }

  delete(requestId: string) {
    this._requests.delete(requestId);
  }

  passthrough(requestId: string) {
    return this._handleRequest(requestId, resolveWithPassthrough);
  }

  respond(requestId: string, response: Response) {
    return this._handleRequest(requestId, resolveWithResponse(response));
  }

  keys() {
    return this._requests.keys();
  }

  private _createRequestId() {
    return uuidv4();
  }

  private _handleRequest(
    requestId: string,
    fn: (req: DeferredRequest) => Promise<Response>
  ): Promise<{ request: Request; response: Response }> {
    if (!this._requests.has(requestId)) {
      console.error(
        '[sw] tried to handle request that was not found',
        requestId
      );
      return Promise.reject();
    }

    const req = this._requests.get(requestId);
    this._requests.delete(requestId);

    return fn(req).then(response => ({ request: req.request, response }));
  }
}
