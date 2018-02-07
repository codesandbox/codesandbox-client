import * as BrowserFS from "../../../src/index";
import WorkerFS from "../../../src/backend/WorkerFS";
import inmemfs_factory from './inmemory_factory';

BrowserFS.BFSRequire('buffer');
// Construct an in-memory file system,
inmemfs_factory((name, objs) => {
  BrowserFS.initialize(objs[0]);
  // Listen for API requests.
  WorkerFS.attachRemoteListener(<Worker> <any> self);
});

