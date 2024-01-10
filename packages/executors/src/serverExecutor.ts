import io from 'socket.io-client';
import { dispatch } from 'codesandbox-api';
import _debug from 'debug';
import axios from 'axios';

import { IExecutor, IFiles, ISetupParams } from './executor';

const debug = _debug('executors:server');

function sseTerminalMessage(msg: string) {
  dispatch({
    type: 'terminal:message',
    data: `> Sandbox Container: ${msg}\n\r`,
  });
}

/**
 * Find the changes from the last run, we only work with saved code here.
 */
const getDiff = (oldFiles: IFiles, newFiles: IFiles) => {
  const diff: IFiles = {};

  Object.keys(newFiles)
    .filter(p => {
      const newSavedCode = newFiles[p].savedCode || newFiles[p].code;
      if (oldFiles[p]) {
        const oldSavedCode = oldFiles[p].savedCode || oldFiles[p].code;
        if (oldSavedCode !== newSavedCode) {
          return true;
        }
      } else {
        return true;
      }

      return false;
    })
    .forEach(p => {
      diff[p] = {
        code: newFiles[p].code,
        path: newFiles[p].path,
        savedCode: newFiles[p].savedCode,
        isBinary: newFiles[p].isBinary,
      };
    });

  Object.keys(oldFiles).forEach(p => {
    if (!newFiles[p]) {
      diff[p] = {
        path: oldFiles[p].path,
        isBinary: false,
        code: null,
        savedCode: null,
      };
    }
  });

  return diff;
};

const MAX_SSE_AGE = 24 * 60 * 60 * 1000; // 1 day
const tick = () => new Promise<void>(r => setTimeout(() => r(), 0));

export class ServerExecutor implements IExecutor {
  socket?: SocketIOClient.Socket;
  connectTimeout: number | null = null;
  token: Promise<string | undefined>;
  host?: string;
  sandboxId?: string;
  lastSent?: IFiles;

  constructor() {
    this.token = this.retrieveSSEToken();
  }

  private async initializeSocket() {
    if (!this.sandboxId) {
      throw new Error('initializeSocket: sandboxId is not defined');
    }
    const usedHost = this.host || 'https://codesandbox.io';
    const sseLbHost = usedHost.replace('https://', 'https://sse-lb.');
    const res = await axios.get(`${sseLbHost}/api/cluster/${this.sandboxId}`);
    const sseHost = res.data.hostname;

    this.socket = io(sseHost, {
      autoConnect: false,
      transports: ['websocket', 'polling'],
    });
  }

  async initialize({ sandboxId, files, host }: ISetupParams) {
    if (this.sandboxId === sandboxId && this.socket?.connected) {
      return;
    }

    this.host = host;
    this.sandboxId = sandboxId;
    this.lastSent = files;

    await this.dispose();
    await tick();

    await this.initializeSocket();
  }

  public async setup() {
    debug('Setting up server executor...');

    return this.openSocket();
  }

  public async dispose() {
    if (this.socket) {
      this.socket.removeAllListeners();
      this.socket.close();
    }
  }

  public updateFiles(newFiles: IFiles) {
    const changedFiles = this.lastSent
      ? getDiff(this.lastSent, newFiles)
      : newFiles;

    this.lastSent = newFiles;

    if (Object.keys(changedFiles).length > 0 && this.socket) {
      debug(
        Object.keys(changedFiles).length + ' files changed, sending to SSE.'
      );
      debug(changedFiles);
      this.socket.emit('sandbox:update', changedFiles);
    }
  }

  public emit(event: string, data?: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, listener: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, listener);
    }
  }

  private openSocket() {
    if (this.socket?.connected) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.socket!.on('connect', async () => {
        try {
          if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
          }

          await this.startSandbox();

          resolve();
        } catch (e) {
          debug('Error connecting to SSE manager: ', e);
          reject(e);
        }
      });

      this.socket!.on('sandbox:start', () => {
        sseTerminalMessage(`Sandbox ${this.sandboxId} started`);
      });

      if (this.socket) {
        this.socket.open();
      }
    });
  }

  private async startSandbox() {
    const token = await this.token;
    if (this.socket) {
      this.socket.emit('sandbox', { id: this.sandboxId, token });
    }

    debug('Connected to sse manager, sending start signal...');
    sseTerminalMessage(`Starting sandbox ${this.sandboxId}...`);
    if (this.socket) {
      this.socket.emit('sandbox:start');
    }
  }

  private async retrieveSSEToken() {
    debug('Retrieving SSE token...');

    const existingKey = localStorage.getItem('sse');
    const currentTime = new Date().getTime();

    if (existingKey) {
      const parsedKey = JSON.parse(existingKey);
      if (parsedKey.key && currentTime - parsedKey.timestamp < MAX_SSE_AGE) {
        debug('Retrieved SSE token from cache');
        return parsedKey.key as string;
      }
    }

    const devJwt = localStorage.getItem('devJwt');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (devJwt) {
      headers.Authorization = `Bearer ${devJwt}`;
    }

    return fetch('/api/v1/users/current_user/sse', {
      method: 'POST',
      headers,
    })
      .then(x => x.json())
      .then(result => result.jwt)
      .then((token: string) => {
        debug('Retrieved SSE token from API');
        localStorage.setItem(
          'sse',
          JSON.stringify({
            key: token,
            timestamp: currentTime,
          })
        );

        return token;
      })
      .catch(() => {
        debug('Not signed in, returning undefined');
        return undefined;
      });
  }
}
