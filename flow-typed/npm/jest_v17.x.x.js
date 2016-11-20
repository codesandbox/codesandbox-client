// flow-typed signature: d52a0d96fedbdaeed9d0715003f024f6
// flow-typed version: fc5874dbeb/jest_v17.x.x/flow_>=v0.33.x

type JestMockFn = {
  (...args: Array<any>): any;
  mock: {
    calls: Array<Array<any>>;
    instances: mixed;
  };
  mockClear(): Function;
  mockImplementation(fn: Function): JestMockFn;
  mockImplementationOnce(fn: Function): JestMockFn;
  mockReturnThis(): void;
  mockReturnValue(value: any): JestMockFn;
  mockReturnValueOnce(value: any): JestMockFn;
}

type JestAsymmetricEqualityType = {
  asymmetricMatch(value: mixed): boolean;
}

type JestCallsType = {
  allArgs(): mixed;
  all(): mixed;
  any(): boolean;
  count(): number;
  first(): mixed;
  mostRecent(): mixed;
  reset(): void;
}

type JestClockType = {
  install(): void;
  mockDate(date: Date): void;
  tick(): void;
  uninstall(): void;
}

type JestMatcherResult = {
  message?: string | ()=>string;
  pass: boolean;
};

type JestMatcher = (actual: any, expected: any) => JestMatcherResult;

type JestExpectType = {
  not: JestExpectType;
  lastCalledWith(...args: Array<any>): void;
  toBe(value: any): void;
  toBeCalled(): void;
  toBeCalledWith(...args: Array<any>): void;
  toBeCloseTo(num: number, delta: any): void;
  toBeDefined(): void;
  toBeFalsy(): void;
  toBeGreaterThan(number: number): void;
  toBeGreaterThanOrEqual(number: number): void;
  toBeLessThan(number: number): void;
  toBeLessThanOrEqual(number: number): void;
  toBeInstanceOf(cls: Class<*>): void;
  toBeNull(): void;
  toBeTruthy(): void;
  toBeUndefined(): void;
  toContain(item: any): void;
  toContainEqual(item: any): void;
  toEqual(value: any): void;
  toHaveBeenCalled(): void;
  toHaveBeenCalledTimes(number: number): void;
  toHaveBeenCalledWith(...args: Array<any>): void;
  toMatch(regexp: RegExp): void;
  toMatchSnapshot(): void;
  toThrow(message?: string | Error): void;
  toThrowError(message?: string | Error | RegExp): void;
  toThrowErrorMatchingSnapshot(): void;
}

type JestSpyType = {
  calls: JestCallsType;
}

declare function afterEach(fn: Function): void;
declare function beforeEach(fn: Function): void;
declare function afterAll(fn: Function): void;
declare function beforeAll(fn: Function): void;
declare function describe(name: string, fn: Function): void;
declare var it: {
  (name: string, fn: Function): ?Promise<void>;
  only(name: string, fn: Function): ?Promise<void>;
  skip(name: string, fn: Function): ?Promise<void>;
};
declare function fit(name: string, fn: Function): ?Promise<void>;
declare var test: typeof it;
declare var xdescribe: typeof describe;
declare var fdescribe: typeof describe;
declare var xit: typeof it;
declare var xtest: typeof it;

declare var expect: {
  (value: any): JestExpectType;
  extend(matchers: {[name:string]: JestMatcher}): void;
};

// TODO handle return type
// http://jasmine.github.io/2.4/introduction.html#section-Spies
declare function spyOn(value: mixed, method: string): Object;

declare var jest: {
  autoMockOff(): void;
  autoMockOn(): void;
  resetAllMocks(): void;
  clearAllTimers(): void;
  currentTestPath(): void;
  disableAutomock(): void;
  doMock(moduleName: string, moduleFactory?: any): void;
  dontMock(moduleName: string): void;
  enableAutomock(): void;
  fn(implementation?: Function): JestMockFn;
  isMockFunction(fn: Function): boolean;
  genMockFromModule(moduleName: string): any;
  mock(moduleName: string, moduleFactory?: any): void;
  resetModules(): void;
  runAllTicks(): void;
  runAllTimers(): void;
  runTimersToTime(msToRun: number): void;
  runOnlyPendingTimers(): void;
  setMock(moduleName: string, moduleExports: any): void;
  unmock(moduleName: string): void;
  useFakeTimers(): void;
  useRealTimers(): void;
}

declare var jasmine: {
  DEFAULT_TIMEOUT_INTERVAL: number;
  any(value: mixed): JestAsymmetricEqualityType;
  anything(): void;
  arrayContaining(value: mixed[]): void;
  clock(): JestClockType;
  createSpy(name: string): JestSpyType;
  objectContaining(value: Object): void;
  stringMatching(value: string): void;
}
