import assert from '../../harness/wrapped-assert';
import {checkOptions} from '../../../src/core/util';
import {FileSystemOptions, FileSystemConstructor} from '../../../src/core/file_system';
import {ApiError} from '../../../src/core/api_error';
import Backends from '../../../src/core/backends';

declare var __numWaiting: number;

function numWaitingWrap(cb: any): any {
  __numWaiting++;
  return function(this: any) {
    __numWaiting--;
    cb.apply(this, arguments);
  }
}

function getFileSystem(opts: FileSystemOptions): FileSystemConstructor {
  return {
    Options: opts,
    Name: "TestFS",
    Create: function() {},
    isAvailable: () => true
  };
}

function noErrorAssert(e?: ApiError) {
  if (e) {
    assert(!e, `Received unplanned error: ${e.toString()}`);
  }
}

function errorMessageAssert(expectedMsgs: string[], unexpectedMsgs: string[] = []): (e?: ApiError) => void {
  let called = false;
  return (e?: ApiError) => {
    assert(called === false, `Callback called twice!`);
    called = true;
    assert(Boolean(e), `Did not receive planned error message.`);
    const errorMessage = e.message;
    for (const m of expectedMsgs) {
      assert(errorMessage.indexOf(m) !== -1, `Error message '${errorMessage}' is missing expected string '${m}'.`);
    }
    for (const m of unexpectedMsgs) {
      assert(errorMessage.indexOf(m) === -1, `Error message '${errorMessage}' unexpectedly contained string '${m}'.`);
    }
  };
}

export default function() {
  // HACK around TypeScript bug.
  if (__numWaiting) {}
  const emptyOptionsFS = getFileSystem({});
  checkOptions(emptyOptionsFS, {}, noErrorAssert);
  // Tolerates unrecognized options.
  checkOptions(emptyOptionsFS, { unrecognized: true }, noErrorAssert);

  const simpleOptionsFS = getFileSystem({
    type: {
      type: 'string',
      optional: false,
      description: "__type_desc__"
    },
    size: {
      type: "number",
      optional: true,
      description: "__size_desc__"
    },
    multitype: {
      type: ["number", "string", "boolean"],
      optional: true,
      description: "__multitype_desc__"
    }
  });
  checkOptions(simpleOptionsFS, { type: "cool", size: Number.POSITIVE_INFINITY }, noErrorAssert);
  // Doesn't mind if optional type is missing or `null`.
  checkOptions(simpleOptionsFS, { type: "cool" }, noErrorAssert);
  checkOptions(simpleOptionsFS, { type: "cool", size: null }, noErrorAssert);
  // *Does* mind if optional type has incorrect type.
  checkOptions(simpleOptionsFS, { type: "cool", size: "cooler" }, errorMessageAssert(['size', 'type', 'number', 'string', '__size_desc__']));
  // Also minds if required type is incorrect type.
  checkOptions(simpleOptionsFS, { type: 3 }, errorMessageAssert(['type', 'string', 'number', '__type_desc__']));
  // Minds if required type is missing. Does not suggest recognized type is proper.
  checkOptions(simpleOptionsFS, { size: 3 }, errorMessageAssert(['type', '__type_desc__'], ['unrecognized', 'perhaps']));
  // Provides helpful hints with mistyped option.
  checkOptions(simpleOptionsFS, { types: "cooled" }, errorMessageAssert(['type', '__type_desc__', 'unrecognized', 'perhaps', 'types']));
  // Supports multiple basic types
  checkOptions(simpleOptionsFS, { type: "cool", multitype: true }, noErrorAssert);
  checkOptions(simpleOptionsFS, { type: "cool", multitype: "true" }, noErrorAssert);
  checkOptions(simpleOptionsFS, { type: "cool", multitype: 1 }, noErrorAssert);
  // Proper error message for options with multiple basic types
  checkOptions(simpleOptionsFS, { type: "cool", multitype: {} }, errorMessageAssert(['multitype', '__multitype_desc__', 'number', 'string', 'boolean', 'object']));

  const validatorFS = getFileSystem({
    asyncFail: {
      type: 'number',
      optional: true,
      description: "__asyncFail_desc__",
      validator: function(v, cb) {
        setTimeout(() => cb(new ApiError(0, '__asyncFail_error__')), 5);
      }
    },
    asyncPass: {
      type: 'number',
      optional: false,
      description: "__asyncPass_desc__",
      validator: function(v, cb) {
        setTimeout(() => cb(), 5);
      }
    },
    syncFail: {
      type: 'number',
      optional: true,
      description: "__syncFail_desc__",
      validator: function(v, cb) { cb(new ApiError(0, '__syncFail_error__')); }
    },
    syncPass: {
      type: 'number',
      description: '__syncPass_desc_',
      validator: function(v, cb) { cb(); }
    }
  });

  // Supports validators.
  checkOptions(validatorFS, { asyncPass: 0, syncPass: 0 }, numWaitingWrap(noErrorAssert));
  // Supports validator error messages.
  checkOptions(validatorFS, { asyncPass: 0, syncPass: 0, syncFail: 0 }, numWaitingWrap(errorMessageAssert(['__syncFail_error__'])));
  checkOptions(validatorFS, { asyncPass: 0, syncPass: 0, asyncFail: 0 }, numWaitingWrap(errorMessageAssert(['__asyncFail_error__'])));

  // Monkey-patched `Create` works with and without options argument.
  (<any> Backends.InMemory.Create)(numWaitingWrap((e: ApiError, rv: any) => {
    noErrorAssert(e);
    // Make sure rv is a real FS.
    rv.readdirSync('/');
  }));
  (<any> Backends.InMemory.Create)({}, numWaitingWrap((e: ApiError, rv: any) => {
    noErrorAssert(e);
    // Make sure rv is a real FS.
    rv.readdirSync('/');
  }));
};
