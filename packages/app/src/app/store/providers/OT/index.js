import { Provider } from 'cerebral';
import { TextOperation } from 'ot';
import CodeSandboxClient from './client';

const modules = new Map();

function getClient(moduleShortid, context, revision = 0) {
  let client = modules.get(moduleShortid);

  if (!client) {
    client = new CodeSandboxClient(revision, moduleShortid, context);
    modules.set(moduleShortid, client);
  }

  return client;
}

export default Provider({
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
  getData() {
    const data = [];

    modules.forEach(m => {
      data.push({
        moduleShortid: m.moduleShortid,
        revision: m.revision,
      });
    });

    return data;
  },
  consumeData(data) {
    data.forEach(({ moduleShortid, revision }) => {
      getClient(moduleShortid, this.context, revision);
    });
  },
  reset() {
    modules.clear();
  },
});
