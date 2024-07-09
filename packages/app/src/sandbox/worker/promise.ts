/**
 * Copied from https://github.com/open-draft/deferred-promise 
 * because the current Babel configuration doesn't support static block in classes
 */

type PromiseState = 'pending' | 'fulfilled' | 'rejected'

 type Executor<Value> = ConstructorParameters<typeof Promise<Value>>[0]
 type ResolveFunction<Value> = Parameters<Executor<Value>>[0]
 type RejectFunction<Reason> = Parameters<Executor<Reason>>[1]

 type DeferredPromiseExecutor<Input = never, Output = Input> = {
  (resolve?: ResolveFunction<Input>, reject?: RejectFunction<any>): void

  resolve: ResolveFunction<Input>
  reject: RejectFunction<any>
  result?: Output
  state: PromiseState
  rejectionReason?: unknown
}
 function createDeferredExecutor<
  Input = never,
  Output = Input
>(): DeferredPromiseExecutor<Input, Output> {
  const executor = <DeferredPromiseExecutor<Input, Output>>((
    resolve,
    reject
  ) => {
    executor.state = 'pending'

    executor.resolve = (data) => {
      if (executor.state !== 'pending') {
        return
      }

      executor.result = data as Output

      const onFulfilled = <Value>(value: Value) => {
        executor.state = 'fulfilled'
        return value
      }

    // eslint-disable-next-line
      return resolve(
        data instanceof Promise ? data : Promise.resolve(data).then(onFulfilled)
      )
    }

    executor.reject = (reason) => {
      if (executor.state !== 'pending') {
        return
      }

      queueMicrotask(() => {
        executor.state = 'rejected'
      })

      // eslint-disable-next-line
      return reject((executor.rejectionReason = reason))
    }
  })

  return executor
}

export class DeferredPromise<Input, Output = Input> extends Promise<Input> {
  executor: DeferredPromiseExecutor;

  public resolve: ResolveFunction<Output>;
  public reject: RejectFunction<Output>;

  constructor(executor: Executor<Input> | null = null) {
    const deferredExecutor = createDeferredExecutor();
    super((originalResolve, originalReject) => {
      deferredExecutor(originalResolve, originalReject);
      // eslint-disable-next-line
      executor?.(deferredExecutor.resolve, deferredExecutor.reject);
    });

    this.executor = deferredExecutor;
    this.resolve = this.executor.resolve;
    this.reject = this.executor.reject;
  }

  public get state() {
    return this.executor.state;
  }

  public get rejectionReason() {
    return this.executor.rejectionReason;
  }

  public then<ThenResult = Input, CatchResult = never>(
    onFulfilled?: (value: Input) => ThenResult | PromiseLike<ThenResult>,
    onRejected?: (reason: any) => CatchResult | PromiseLike<CatchResult>
  ) {
    return this.decorate(super.then(onFulfilled, onRejected));
  }

  public catch<CatchResult = never>(
    onRejected?: (reason: any) => CatchResult | PromiseLike<CatchResult>
  ) {
    return this.decorate(super.catch(onRejected));
  }

  public finally(onfinally?: () => void | Promise<any>) {
    return this.decorate(super.finally(onfinally));
  }

  decorate<ChildInput>(
    promise: Promise<ChildInput>
  ): DeferredPromise<ChildInput, Output> {
    return Object.defineProperties(promise, {
      resolve: { configurable: true, value: this.resolve },
      reject: { configurable: true, value: this.reject },
    }) as DeferredPromise<ChildInput, Output>;
  }
}