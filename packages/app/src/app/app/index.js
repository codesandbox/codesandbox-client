import { Module } from 'cerebral';
import HttpProvider from '@cerebral/http';

import model from './model';
import ApiProvider from './providers/Api';
import ConnectionProvider from './providers/Connection';
import JwtProvider from './providers/Jwt';
import * as sequences from './sequences';
import * as errors from './errors';

export default Module({
  model,
  state: {
    user: null,
    connected: true,
  },
  signals: {
    appMounted: sequences.loadApp,
    appUnmounted: sequences.unloadApp,
    connectionChanged: sequences.setConnection,
  },
  catch: [[errors.AuthenticationError, sequences.showAuthenticationError]],
  providers: {
    api: ApiProvider,
    connection: ConnectionProvider,
    jwt: JwtProvider,
    http: HttpProvider(),
  },
});
