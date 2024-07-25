export const CHANNEL_NAME = '$CSB_RELAY';

export interface IPreviewReadyMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'preview/ready';
}

export interface IPreviewInitMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'preview/init';
}

export interface IPreviewRequestMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'preview/request';
  id: string;
  method: string;
  url: string;
}

export interface IPreviewResponseMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'preview/response';
  id: string;
  status: number;
  headers: Record<string, string>;
  body: string | Uint8Array;
}

export interface IWorkerPingMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'worker/ping';
}

export interface IWorkerPongMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'worker/pong';
}

export interface IWorkerInitMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'worker/init';
}

export interface IWokerInvalidatePortMessage {
  $channel: typeof CHANNEL_NAME;
  $type: 'worker/invalidate-port';
}

export type MessageSentToWorker =
  | IWorkerPingMessage
  | IPreviewResponseMessage
  | IWorkerInitMessage
  | IWokerInvalidatePortMessage;
export type MessageReceivedFromWorker =
  | IPreviewRequestMessage
  | IWorkerPongMessage;
export type MessageSentToMain = IPreviewRequestMessage | IPreviewReadyMessage;
