import Protocol from '../protocol';

describe('protocol', () => {
  beforeAll(() => {
    // @ts-ignore
    global.Worker = class Worker {};
  });

  afterAll(() => {
    // @ts-ignore
    delete global.Worker;
  });

  it('resolves a promise for a request', async () => {
    const p1 = new Protocol('test', () => 'blaat', self);
    const p2 = new Protocol('test', () => 'taalb', self);

    const [res1, res2] = await Promise.all([p1.sendMessage('koekje'), p2.sendMessage('koekje')]);

    expect(res1).toBe('taalb');
    expect(res2).toBe('blaat');

    p1.dispose();
    p2.dispose();
  });

  it('can read and respond to data', async () => {
    const p1 = new Protocol(
      'test',
      (s: string) =>
        s
          .split('')
          .reverse()
          .join(''),
      self
    );
    const p2 = new Protocol('test', () => 'taalb', self);

    const res = await p2.sendMessage('ab');

    expect(res).toBe('ba');

    p1.dispose();
    p2.dispose();
  });

  it('ignores the wrong listener types', async () => {
    const p1 = new Protocol(
      'test',
      (s: string) =>
        s
          .split('')
          .reverse()
          .join(''),
      self
    );
    const p2 = new Protocol('aa', () => 'saalp', self);
    const p3 = new Protocol(
      'test',
      () => new Promise(r => setTimeout(() => r('taalb'), 1000)),
      self
    );

    const res = await p1.sendMessage('kk');

    expect(res).toBe('taalb');

    p1.dispose();
    p2.dispose();
    p3.dispose();
  });
});
