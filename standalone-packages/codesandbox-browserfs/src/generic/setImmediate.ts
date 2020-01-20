import global from '../core/global';

/**
 * @hidden
 */
let bfsSetImmediate: (cb: Function, ...args: any[]) => any;
if (typeof(setImmediate) !== "undefined") {
  bfsSetImmediate = setImmediate;
} else {
  const gScope = global;
  const timeouts: ({ fn: (...args: any[]) => void, args: any[] })[] = [];
  const messageName = "zero-timeout-message";
  const canUsePostMessage = function() {
    if (typeof gScope.importScripts !== 'undefined' || !gScope.postMessage) {
      return false;
    }
    let postMessageIsAsync = true;
    const oldOnMessage = gScope.onmessage;
    gScope.onmessage = function() {
      postMessageIsAsync = false;
    };
    gScope.postMessage('', '*');
    gScope.onmessage = oldOnMessage;
    return postMessageIsAsync;
  };
  if (canUsePostMessage()) {
    bfsSetImmediate = function(fn: () => void, ...args: any[]) {
      timeouts.push({ fn, args });
      gScope.postMessage(messageName, "*");
    };
    const handleMessage = function(event: MessageEvent) {
      if (event.source === self && event.data === messageName) {
        if (event.stopPropagation) {
          event.stopPropagation();
        } else {
          event.cancelBubble = true;
        }
        if (timeouts.length > 0) {
          const { fn, args } = timeouts.shift()!;
          return fn(...args);
        }
      }
    };
    if (gScope.addEventListener) {
      gScope.addEventListener('message', handleMessage, true);
    } else {
      gScope.attachEvent('onmessage', handleMessage);
    }
  } else if (gScope.MessageChannel) {
    // WebWorker MessageChannel
    const channel = new gScope.MessageChannel();
    channel.port1.onmessage = (event: any) => {
      if (timeouts.length > 0) {
        const { fn, args } = timeouts.shift()!;
        return fn(...args);
      }
    };
    bfsSetImmediate = (fn: () => void, ...args: any[]) => {
      timeouts.push({ fn, args });
      channel.port2.postMessage('');
    };
  } else {
    bfsSetImmediate = function(fn: () => void, ...args: any[]) {
      return setTimeout(fn, 0, ...args);
    };
  }
}

export default bfsSetImmediate;
