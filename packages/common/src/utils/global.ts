import { protocolAndHost } from './url-generator';

export function getGlobal() {
  try {
    if (typeof window !== 'undefined') {
      return (window as unknown) as Window & { BrowserFS: any };
    }

    if (typeof self !== 'undefined') {
      const returnedGlobal: unknown = self;
      return returnedGlobal as Worker & { BrowserFS: any };
    }

    if (typeof global !== 'undefined') {
      return global;
    }
  } catch (e) {
    /* Couldn't find anything */
  }

  return {};
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
