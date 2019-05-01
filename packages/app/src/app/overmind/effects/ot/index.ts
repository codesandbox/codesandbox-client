import { TextOperation } from 'ot';
import CodeSandboxClient from './client';

const modules = new Map();

function getClient(moduleShortid, context, revision = 0, force = false) {
  let client = modules.get(moduleShortid);

  if (!client || force) {
    client = new CodeSandboxClient(revision, moduleShortid, context);
    modules.set(moduleShortid, client);
  }

  return client;
}

export default {
  applyClient(moduleShortid: string, operation) {
    getClient(moduleShortid, this.context).applyClient(
      TextOperation.fromJSON(operation)
    );
  },
  applyServer(moduleShortid: string, operation) {
    getClient(moduleShortid, this.context).applyServer(
      TextOperation.fromJSON(operation)
    );
  },
  serverReconnect() {
    modules.forEach(client => {
      client.serverReconnect();
    });
  },
  serverAck(moduleShortid: string) {
    getClient(moduleShortid, this.context).serverAck();
  },
  initializeModule(moduleShortid, revision) {
    getClient(moduleShortid, this.context, revision, true);
  },
  reset() {
    modules.clear();
  },
};
