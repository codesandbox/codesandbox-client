import { TextOperation } from 'ot';

/*
  DEPRECATED, NOT IN USE, JUST REFERENCE
*/

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
