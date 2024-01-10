import { getTextOperation } from '@codesandbox/common/lib/utils/diff';
import { CodeSandboxOTClient } from './clients';

describe('OTClient', () => {
  it("it doesn't acknowledge the same revision twice", async () => {
    const client = new CodeSandboxOTClient(
      0,
      'test',
      (revision, operation) => Promise.resolve({}),
      operation => {}
    );

    const op = getTextOperation('ab', 'a');

    // The case we're trying to solve here:
    // (1) applyClient -> (no ack received)
    // -----
    // serverReconnect
    // (2) applyClient. Sent by serverReconnect
    // (1) resolves. Resolved because of Phoenix
    // (2) resolves. Resolved because of server reconnect

    client.applyClient(op);
    await client.sendOperation(0, op);

    expect(client.revision).toBe(1);
  });
});
