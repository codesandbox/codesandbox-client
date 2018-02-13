import WorkerFS from "../../../src/backend/WorkerFS";
import {FileSystem} from '../../../src/core/file_system';

export default function WorkerFSFactory(cb: (name: string, obj: FileSystem[]) => void): void {
  if (WorkerFS.isAvailable()) {
    // Set up a worker, which will host an in-memory FS.
    const worker = new Worker("/test/harness/factories/workerfs_worker.js");
    WorkerFS.Create({ worker: worker }, function(e, workerFs?) {
      cb("WorkerFS", [workerFs]);
    });
  } else {
    cb("WorkerFS", []);
  }
}
