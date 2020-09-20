import { IDisposable, Disposable } from './disposable';
import { Deferred } from './deferred';
import { ObjectsTransferrer } from './transferer';
import { IConnection } from './connection';

export const RPCProtocol = Symbol('RPCProtocol');

export interface RPCProtocol extends IDisposable {
  /**
   * Returns a proxy to an object addressable/named in the plugin process or in the main process.
   */
  getProxy<T>(proxyId: ProxyIdentifier<T>): T;

  /**
   * Register manually created instance.
   */
  set<T, R extends T>(identifier: ProxyIdentifier<T>, instance: R): R;
}

export class ProxyIdentifier<T> {
  constructor(public readonly isMain: boolean, public readonly id: string) {}
}

export function createProxyIdentifier<T>(identifier: string) {
  return new ProxyIdentifier<T>(false, identifier);
}

export class RPCProtocolImpl extends Disposable implements RPCProtocol {
  private readonly locals = new Map<string, any>();
  private readonly proxies = new Map<string, any>();
  private lastMessageId = 0;
  private remoteHostID: string | undefined;
  private messageToSendHostId: string | undefined;
  private pendingRPCReplies = new Map<string, Deferred<RPCMessage>>();

  constructor(private connection: IConnection) {
    super();

    this.toDispose.push(
      connection.onReceive((message) => {
        this.receiveMessage(message);
      })
    );

    this.toDispose.push(
      Disposable.create(() => {
        this.proxies.clear();
        for (const reply of this.pendingRPCReplies.values()) {
          reply.reject(ConnectionClosedError.create());
        }
        this.pendingRPCReplies.clear();
      })
    );
  }

  getProxy<T>(proxyId: ProxyIdentifier<T>): T {
    if (this.isDisposed) {
      throw ConnectionClosedError.create();
    }
    let proxy = this.proxies.get(proxyId.id);
    if (!proxy) {
      proxy = this.createProxy(proxyId.id);
      this.proxies.set(proxyId.id, proxy);
    }
    return proxy;
  }

  set<T, R extends T>(identifier: ProxyIdentifier<T>, instance: R): R {
    if (this.isDisposed) {
      throw ConnectionClosedError.create();
    }
    this.locals.set(identifier.id, instance);
    if (Disposable.is(instance)) {
      this.toDispose.push(instance);
    }
    this.toDispose.push(
      Disposable.create(() => this.locals.delete(identifier.id))
    );
    return instance;
  }

  private createProxy<T>(proxyId: string): T {
    const handler = {
      get: (target: any, name: string) => {
        if (
          !target[name] &&
          name.charCodeAt(0) === 36 /* CharCode.DollarSign */
        ) {
          target[name] = (...myArgs: any[]) =>
            this.remoteCall(proxyId, name, myArgs);
        }
        return target[name];
      },
    };
    return new Proxy(Object.create(null), handler);
  }

  private remoteCall(
    proxyId: string,
    methodName: string,
    args: any[]
  ): Promise<RPCMessage> {
    const callId = String(++this.lastMessageId);
    const result = new Deferred<RPCMessage>();

    this.pendingRPCReplies.set(callId, result);
    this.connection.send(
      MessageFactory.request(
        callId,
        proxyId,
        methodName,
        args,
        this.messageToSendHostId
      )
    );
    return result.promise;
  }

  private receiveMessage(rawmsg: string): void {
    if (this.isDisposed) {
      return;
    }

    const msg = <RPCMessage>JSON.parse(rawmsg, ObjectsTransferrer.reviver);

    // handle message that sets the Host ID
    if ((<any>msg).setHostID) {
      this.messageToSendHostId = (<any>msg).setHostID;
      return;
    }

    // skip message if not matching host
    if (
      this.remoteHostID &&
      (<any>msg).hostID &&
      this.remoteHostID !== (<any>msg).hostID
    ) {
      return;
    }

    switch (msg.type) {
      case MessageType.Request:
        this.receiveRequest(msg);
        break;
      case MessageType.Reply:
        this.receiveReply(msg);
        break;
      case MessageType.ReplyErr:
        this.receiveReplyErr(msg);
        break;
      case MessageType.Cancel:
        throw new Error('Not implemented');
        break;
    }
  }

  private receiveRequest(msg: RequestMessage): void {
    const callId = msg.id;
    const proxyId = msg.proxyId;

    const invocation = this.invokeHandler(proxyId, msg.method, msg.args);

    invocation.then(
      (result) => {
        this.connection.send(
          MessageFactory.replyOK(callId, result, this.messageToSendHostId)
        );
      },
      (error) => {
        this.connection.send(
          MessageFactory.replyErr(callId, error, this.messageToSendHostId)
        );
      }
    );
  }

  private receiveReply(msg: ReplyMessage): void {
    const callId = msg.id;
    const pendingReply = this.pendingRPCReplies.get(callId);
    if (!pendingReply) {
      return;
    }
    this.pendingRPCReplies.delete(callId);
    pendingReply.resolve(msg.res);
  }

  private receiveReplyErr(msg: ReplyErrMessage): void {
    const callId = msg.id;
    const pendingReply = this.pendingRPCReplies.get(callId);
    if (!pendingReply) {
      return;
    }
    this.pendingRPCReplies.delete(callId);

    let err: Error | undefined = undefined;
    if (msg.err && msg.err.$isError) {
      err = new Error();
      err.name = msg.err.name;
      err.message = msg.err.message;
      err.stack = msg.err.stack;
    }
    pendingReply.reject(err);
  }

  private invokeHandler(
    proxyId: string,
    methodName: string,
    args: any[]
  ): Promise<any> {
    try {
      return Promise.resolve(this.doInvokeHandler(proxyId, methodName, args));
    } catch (err) {
      return Promise.reject(err);
    }
  }

  private doInvokeHandler(
    proxyId: string,
    methodName: string,
    args: any[]
  ): any {
    const actor = this.locals.get(proxyId);
    if (!actor) {
      throw new Error('Unknown actor ' + proxyId);
    }
    const method = actor[methodName];
    if (typeof method !== 'function') {
      throw new Error('Unknown method ' + methodName + ' on actor ' + proxyId);
    }
    return method.apply(actor, args);
  }
}

export interface ConnectionClosedError extends Error {
  code: 'RPC_PROTOCOL_CLOSED';
}
export namespace ConnectionClosedError {
  const code: ConnectionClosedError['code'] = 'RPC_PROTOCOL_CLOSED';
  export function create(
    message: string = 'connection is closed'
  ): ConnectionClosedError {
    return Object.assign(new Error(message), { code });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function is(error: any): error is ConnectionClosedError {
    return (
      !!error &&
      typeof error === 'object' &&
      'code' in error &&
      error['code'] === code
    );
  }
}

export const enum MessageType {
  Request = 1,
  Reply = 2,
  ReplyErr = 3,
  Cancel = 4,
  Terminate = 5,
  Terminated = 6,
}

class MessageFactory {
  static cancel(req: string, messageToSendHostId?: string): string {
    let prefix = '';
    if (messageToSendHostId) {
      prefix = `"hostID":"${messageToSendHostId}",`;
    }
    return `{${prefix}"type":${MessageType.Cancel},"id":"${req}"}`;
  }

  public static request(
    req: string,
    rpcId: string,
    method: string,
    args: any[],
    messageToSendHostId?: string
  ): string {
    let prefix = '';
    if (messageToSendHostId) {
      prefix = `"hostID":"${messageToSendHostId}",`;
    }
    return `{${prefix}"type":${
      MessageType.Request
    },"id":"${req}","proxyId":"${rpcId}","method":"${method}","args":${JSON.stringify(
      args,
      ObjectsTransferrer.replacer
    )}}`;
  }

  public static replyOK(
    req: string,
    res: any,
    messageToSendHostId?: string
  ): string {
    let prefix = '';
    if (messageToSendHostId) {
      prefix = `"hostID":"${messageToSendHostId}",`;
    }
    if (typeof res === 'undefined') {
      return `{${prefix}"type":${MessageType.Reply},"id":"${req}"}`;
    }
    return `{${prefix}"type":${
      MessageType.Reply
    },"id":"${req}","res":${JSON.stringify(res, ObjectsTransferrer.replacer)}}`;
  }

  public static replyErr(
    req: string,
    err: any,
    messageToSendHostId?: string
  ): string {
    let prefix = '';
    if (messageToSendHostId) {
      prefix = `"hostID":"${messageToSendHostId}",`;
    }
    err = typeof err === 'string' ? new Error(err) : err;
    if (err instanceof Error) {
      return `{${prefix}"type":${
        MessageType.ReplyErr
      },"id":"${req}","err":${JSON.stringify(
        transformErrorForSerialization(err)
      )}}`;
    }
    return `{${prefix}"type":${MessageType.ReplyErr},"id":"${req}","err":null}`;
  }
}

export interface SerializedError {
  readonly $isError: true;
  readonly name: string;
  readonly message: string;
  readonly stack: string;
}

export function transformErrorForSerialization(error: Error): SerializedError {
  if (error instanceof Error) {
    const { name, message } = error;
    const stack: string = (<any>error).stacktrace || error.stack;
    return {
      $isError: true,
      name,
      message,
      stack,
    };
  }

  // return as is
  return error;
}

interface CancelMessage {
  type: MessageType.Cancel;
  id: string;
}

interface RequestMessage {
  type: MessageType.Request;
  id: string;
  proxyId: string;
  method: string;
  args: any[];
}

interface ReplyMessage {
  type: MessageType.Reply;
  id: string;
  res: any;
}

interface ReplyErrMessage {
  type: MessageType.ReplyErr;
  id: string;
  err: SerializedError;
}

type RPCMessage =
  | RequestMessage
  | ReplyMessage
  | ReplyErrMessage
  | CancelMessage;
