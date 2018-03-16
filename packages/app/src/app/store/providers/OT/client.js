import { Client } from 'ot';

function operationToElixir(ot) {
  return ot.map(op => {
    if (typeof op === 'number') {
      if (op < 0) {
        return { d: -op };
      }

      return op;
    }

    return { i: op };
  });
}

export default class CodeSandboxOTClient extends Client {
  constructor(revision: number, moduleShortid: string, context: any) {
    super(revision);

    this.context = context;
    this.moduleShortid = moduleShortid;
  }

  sendOperation(revision, operation) {
    this.context.live.send('operation', {
      moduleShortid: this.moduleShortid,
      operation: operationToElixir(operation.toJSON()),
      revision,
    });
  }

  applyOperation(operation) {
    const signal = this.context.controller.getSignal(
      'live.applyTransformation'
    );

    signal({
      moduleShortid: this.moduleShortid,
      operation: operation.toJSON(),
    });
  }
}
