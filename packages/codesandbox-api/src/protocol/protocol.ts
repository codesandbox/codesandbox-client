const generateId = () =>
  // Such a random ID
  Math.floor(Math.random() * 1000000 + Math.random() * 1000000);

const getConstructorName = (x: any) => {
  try {
    return x.constructor.name;
  } catch(e) {
    return '';
  }
};

export default class Protocol {
  private outgoingMessages: Set<number> = new Set();
  private internalId: number;
  private isWorker: boolean;

  constructor(
    private type: string,
    private handleMessage: (message: any) => any,
    private target: Worker | Window
  ) {
    this.createConnection();
    this.internalId = generateId();
    this.isWorker = getConstructorName(target) === 'Worker';
  }

  getTypeId() {
    return `p-${this.type}`;
  }

  createConnection() {
    self.addEventListener('message', this._messageListener);
  }

  public dispose() {
    self.removeEventListener('message', this._messageListener);
  }

  sendMessage<PromiseType>(data: any): Promise<PromiseType> {
    return new Promise(resolve => {
      const messageId = generateId();

      const message = {
        $originId: this.internalId,
        $type: this.getTypeId(),
        $data: data,
        $id: messageId,
      };

      this.outgoingMessages.add(messageId);

      const listenFunction = (e: MessageEvent) => {
        const { data } = e;

        if (
          data.$type === this.getTypeId() &&
          data.$id === messageId &&
          data.$originId !== this.internalId
        ) {
          resolve(data.$data);

          self.removeEventListener('message', listenFunction);
        }
      };

      self.addEventListener('message', listenFunction);

      this._postMessage(message);
    });
  }

  private _messageListener = async (e: MessageEvent) => {
    const { data } = e;

    if (data.$type !== this.getTypeId()) {
      return;
    }

    // We are getting a response to the message
    if (this.outgoingMessages.has(data.$id)) {
      return;
    }

    const result = await this.handleMessage(data.$data);

    const returnMessage = {
      $originId: this.internalId,
      $type: this.getTypeId(),
      $data: result,
      $id: data.$id,
    };

    if (e.source) {
      // @ts-ignore
      e.source.postMessage(returnMessage, '*');
    } else {
      this._postMessage(returnMessage);
    }
  };

  private _postMessage(m: any) {
    if (
      this.isWorker ||
      // @ts-ignore Unknown to TS
      (typeof DedicatedWorkerGlobalScope !== 'undefined' &&
        // @ts-ignore Unknown to TS
        this.target instanceof DedicatedWorkerGlobalScope)
    ) {
      // @ts-ignore
      this.target.postMessage(m);
    } else {
      (this.target as Window).postMessage(m, '*');
    }
  }
}
