import {
  IModuleStateModule,
  LiveMessageEvent,
  RoomInfo,
} from '@codesandbox/common/lib/types';
import _debug from '@codesandbox/common/lib/utils/debug';
import VERSION from '@codesandbox/common/lib/version';
import { camelizeKeys } from 'humps';
import { Channel, Socket } from 'phoenix';

import { AxiosError } from 'axios';

type Options = {
  provideJwtToken(): Promise<string>;
};

type JoinChannelResponse = {
  liveUserId: string;
  reconnectToken: string;
  roomInfo: RoomInfo;
  moduleState: {
    [moduleId: string]: IModuleStateModule;
  };
};

type JoinChannelErrorResponse = {
  reason: 'room not found' | string;
};

declare global {
  interface Window {
    socket: any;
  }
}

class Live {
  public socket: Socket;

  private pendingMessages = new Map();
  private debug = _debug('cs:socket');
  private channel: Channel | null;
  private provideJwtToken: () => Promise<string>;

  initialize(options: Options) {
    this.provideJwtToken = options.provideJwtToken;
  }

  getSocket() {
    if (!this.connectionPromise) {
      this.connectionPromise = this.connect();
    }

    return this.connectionPromise;
  }

  private jwtPromise: Promise<string> | undefined;
  /**
   * Will return a promise for new jwt token, but if there's already a request
   * underway it will return the existing promise. This is to prevent spamming
   * the server with thousands of requests.
   */
  private provideJwtCached() {
    if (!this.jwtPromise) {
      this.jwtPromise = this.provideJwtToken()
        .catch(e => {
          this.jwtPromise = undefined;
          return Promise.reject(e);
        })
        .then(jwt => {
          // Token expires after 10 minutes, we cache the token for 8 minutes.
          const timeout = 1000 * 60 * 8;
          setTimeout(() => {
            this.jwtPromise = undefined;
          }, timeout);

          return jwt;
        });
    }

    return this.jwtPromise;
  }

  private connectionPromise: Promise<Socket>;
  private async connect(): Promise<Socket> {
    if (!this.socket) {
      const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';

      let jwt = await this.provideJwtCached();
      const params = () => ({
        guardian_token: jwt,
        client_version: VERSION,
      });

      // An offset between 1 and 1.7;
      const defaultReconnectOffset = 1 + Math.random() * 0.7;
      let isServerDown = false;
      const reconnectAfterMs = (tries: number) => {
        if (isServerDown) {
          return Math.floor(3000 + Math.random() * 2000);
        }

        // Based on the times tried we slowly increase the reconnect timeout, so first time
        // we try to reconnect in 10ms, second time in 50ms, third time in 100ms, fourth time in 150ms,
        // etc...
        return Math.floor(
          [10, 50, 100, 150, 200, 250, 500, 1000, 2000][tries - 1] *
            defaultReconnectOffset
        );
      };

      this.socket = new Socket(`${protocol}://${location.host}/socket`, {
        params,
        reconnectAfterMs,
      });

      let tries = 0;
      this.socket.onError(async () => {
        // Regenerate a new JWT for the reconnect. This can be out of sync or happen more often than needed, but it's important
        // to try multiple times in case there's a connection issue.
        try {
          const newJwt = await this.provideJwtCached();
          jwt = newJwt;
          tries = 0;
        } catch (e) {
          const error = e as AxiosError;
          if (error.response?.status === 401 && tries++ > 4) {
            // If we can't get a jwt because we're unauthorized, disconnect...
            this.socket.disconnect();
            tries = 0;
          }

          // We have a 503 Bad Gateway, which means that the server is struggling. We need to increase
          // the timeout...
          if (error.response?.status === 503) {
            isServerDown = true;
          } else {
            isServerDown = false;
          }
        }
      });

      this.socket.connect();
      window.socket = this.socket;
      this.debug('Connecting to socket', this.socket);
    }

    return this.socket;
  }

  disconnect() {
    return new Promise((resolve, reject) => {
      if (!this.channel) {
        resolve({});
        return;
      }

      this.channel
        .leave()
        .receive('ok', resp => {
          if (!this.channel) {
            return resolve({});
          }

          this.channel.onMessage = d => d;
          this.channel = null;
          this.pendingMessages.clear();

          return resolve(resp);
        })
        // eslint-disable-next-line prefer-promise-reject-errors
        .receive('error', resp => reject(resp));
    });
  }

  async joinChannel(
    roomId: string,
    onError: (reason: string) => void
  ): Promise<JoinChannelResponse> {
    const socket = await this.getSocket();
    return new Promise((resolve, reject) => {
      this.channel = socket.channel(`live:${roomId}`, { version: 2 });

      this.channel
        .join()
        .receive('ok', resp => {
          const result = camelizeKeys(resp) as JoinChannelResponse;
          result.moduleState = resp.module_state; // Don't camelize this!!

          // We rewrite what our reconnect params are by adding the reconnect token.
          // This token makes sure that you can retain state between reconnects and restarts
          // from the server
          // @ts-ignore
          this.channel.joinPush.payload = () => ({
            version: 2,
            reconnect_token: result.reconnectToken,
          });

          resolve(result);
        })
        .receive('error', (resp: JoinChannelErrorResponse) => {
          if (resp.reason === 'room not found') {
            if (this.channel) {
              this.channel.leave();
            }
            onError(resp.reason);
          }
          reject(camelizeKeys(resp));
        });
    });
  }

  // TODO: Need to take an action here
  listen(
    action: (payload: {
      event: LiveMessageEvent;
      _isOwnMessage: boolean;
      data: object;
    }) => {}
  ) {
    if (!this.channel) {
      return;
    }

    this.channel.onMessage = (event: any, data: any) => {
      const disconnected =
        (data == null || Object.keys(data).length === 0) &&
        event === 'phx_error';
      const alteredEvent = disconnected ? 'connection-loss' : event;

      const _isOwnMessage = Boolean(
        data && data._messageId && this.pendingMessages.delete(data._messageId)
      );

      if (event && (event === 'phx_reply' || event.startsWith('chan_reply_'))) {
        // No action listens to this
        return data;
      }

      action({
        event: alteredEvent,
        _isOwnMessage,
        data: data == null ? {} : data,
      });

      return data;
    };
  }
}

export default new Live();
