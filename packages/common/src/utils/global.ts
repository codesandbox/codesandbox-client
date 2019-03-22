import { protocolAndHost } from './url-generator';

export function getGlobal() {
  if (typeof window !== 'undefined') {
    return window as Window & { BrowserFS: any };
  }

  if (typeof self !== 'undefined') {
    const returnedGlobal: unknown = self;
    return returnedGlobal as Worker & { BrowserFS: any };
  }

  return global;
}

const global = getGlobal();

/**
 * A postmessage that works in main window and in worker.
 * It will send the message to the default origin.
 * @param message The message to send
 */
export function commonPostMessage(message: any) {
  if (typeof Window !== 'undefined') {
    (global as Window).postMessage(message, protocolAndHost());
  } else {
    (global as Worker).postMessage(message);
  }
}
