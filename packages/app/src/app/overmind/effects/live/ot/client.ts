// translation of https://github.com/djspiewak/cccp/blob/master/agent/src/main/scala/com/codecommit/cccp/agent/state.scala
/* eslint-disable react/no-access-state-in-setstate */

type Operation = any;

interface IState {
  applyClient(client: OTClient, operation: Operation): IState;
  applyServer(client: OTClient, operation: Operation): IState;
  serverAck(client: OTClient): IState;
  transformSelection<T>(selection: T): T;
  resend?(client: OTClient): void;
}

// In the 'Synchronized' state, there is no pending operation that the client
// has sent to the server.
class Synchronized implements IState {
  applyClient(client: OTClient, operation: Operation) {
    // When the user makes an edit, send the operation to the server and
    // switch to the 'AwaitingConfirm' state
    client.sendOperation(client.revision, operation);
    return new AwaitingConfirm(operation);
  }

  applyServer(client: OTClient, operation: Operation) {
    // When we receive a new operation from the server, the operation can be
    // simply applied to the current document
    client.applyOperation(operation);
    return this;
  }

  serverAck(client: OTClient): IState {
    throw new Error('There is no pending operation.');
  }

  // Nothing to do because the latest server state and client state are the same.
  transformSelection(x) {
    return x;
  }
}

// Singleton
const synchronized_ = new Synchronized();

// In the 'AwaitingConfirm' state, there's one operation the client has sent
// to the server and is still waiting for an acknowledgement.
class AwaitingConfirm implements IState {
  outstanding: Operation;

  constructor(outstanding: Operation) {
    // Save the pending operation
    this.outstanding = outstanding;
  }

  applyClient(client: OTClient, operation: Operation) {
    // When the user makes an edit, don't send the operation immediately,
    // instead switch to 'AwaitingWithBuffer' state
    return new AwaitingWithBuffer(this.outstanding, operation);
  }

  applyServer(client: OTClient, operation: Operation) {
    // This is another client's operation. Visualization:
    //
    //                   /\
    // this.outstanding /  \ operation
    //                 /    \
    //                 \    /
    //  pair[1]         \  / pair[0] (new outstanding)
    //  (can be applied  \/
    //  to the client's
    //  current document)
    const pair = operation.constructor.transform(this.outstanding, operation);
    client.applyOperation(pair[1]);
    return new AwaitingConfirm(pair[0]);
  }

  serverAck(client: OTClient) {
    // The client's operation has been acknowledged
    // => switch to synchronized state
    return synchronized_;
  }

  transformSelection(selection: any) {
    return selection.transform(this.outstanding);
  }

  resend(client: OTClient) {
    // The confirm didn't come because the client was disconnected.
    // Now that it has reconnected, we resend the outstanding operation.
    client.sendOperation(client.revision, this.outstanding);
  }
}

// In the 'AwaitingWithBuffer' state, the client is waiting for an operation
// to be acknowledged by the server while buffering the edits the user makes
class AwaitingWithBuffer implements IState {
  outstanding: Operation;
  buffer: Operation;

  constructor(outstanding: Operation, buffer: Operation) {
    // Save the pending operation and the user's edits since then
    this.outstanding = outstanding;
    this.buffer = buffer;
  }

  applyClient(client: OTClient, operation: Operation) {
    // Compose the user's changes onto the buffer
    const newBuffer = this.buffer.compose(operation);
    return new AwaitingWithBuffer(this.outstanding, newBuffer);
  }

  applyServer(client: OTClient, operation: Operation) {
    // Operation comes from another client
    //
    //                       /\
    //     this.outstanding /  \ operation
    //                     /    \
    //                    /\    /
    //       this.buffer /  \* / pair1[0] (new outstanding)
    //                  /    \/
    //                  \    /
    //          pair2[1] \  / pair2[0] (new buffer)
    // the transformed    \/
    // operation -- can
    // be applied to the
    // client's current
    // document
    //
    // * pair1[1]
    const transform = operation.constructor.transform;
    const pair1 = transform(this.outstanding, operation);
    const pair2 = transform(this.buffer, pair1[1]);
    client.applyOperation(pair2[1]);
    return new AwaitingWithBuffer(pair1[0], pair2[0]);
  }

  serverAck(client: OTClient) {
    // The pending operation has been acknowledged
    // => send buffer
    client.sendOperation(client.revision, this.buffer);
    return new AwaitingConfirm(this.buffer);
  }

  transformSelection(selection: any) {
    return selection.transform(this.outstanding).transform(this.buffer);
  }

  resend(client: OTClient) {
    // The confirm didn't come because the client was disconnected.
    // Now that it has reconnected, we resend the outstanding operation.
    client.sendOperation(client.revision, this.outstanding);
  }
}

export abstract class OTClient {
  revision: number;
  state: IState;

  constructor(revision: number) {
    this.revision = revision;
    this.state = synchronized_;
  }

  setState(state: IState) {
    this.state = state;
  }

  // Call this method when the user changes the document.
  applyClient(operation: Operation) {
    this.setState(this.state.applyClient(this, operation));
  }

  // Call this method with a new operation from the server
  applyServer(operation: Operation) {
    this.revision++;
    this.setState(this.state.applyServer(this, operation));
  }

  serverAck() {
    this.revision++;
    this.setState(this.state.serverAck(this));
  }

  serverReconnect() {
    if (typeof this.state.resend === 'function') {
      this.state.resend(this);
    }
  }

  // Transforms a selection from the latest known server state to the current
  // client state. For example, if we get from the server the information that
  // another user's cursor is at position 3, but the server hasn't yet received
  // our newest operation, an insertion of 5 characters at the beginning of the
  // document, the correct position of the other user's cursor in our current
  // document is 8.
  transformSelection(selection) {
    return this.state.transformSelection(selection);
  }

  abstract sendOperation(revision: number, operation: Operation): void;

  abstract applyOperation(operation: Operation): void;
}
