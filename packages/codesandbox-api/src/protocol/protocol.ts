const generateId = () => {
  // Such a random ID
  return Math.random() * 1000000 + Math.random() * 1000000 + '';
};

export default class Protocol {
  private outgoingMessages: Set<string> = new Set();
  private internalId: string;

  constructor(
    private type: string,
    private handleMessage: (message: any) => any,
    private target: Worker | Window
  ) {
    this.createConnection();
    this.internalId = generateId();
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

  sendMessage(data: any): Promise<any> {
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
      e.source.postMessage(returnMessage, '*');
    } else {
      this._postMessage(returnMessage);
    }
  };

  private _postMessage(m: any) {
    if (this.target instanceof Worker) {
      this.target.postMessage(m);
    } else {
      this.target.postMessage(m, '*');
    }
  }
}

// {
//   isFile(),
//   readFile(),
// }
