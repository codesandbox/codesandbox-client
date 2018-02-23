// flow-typed signature: f10f9cc4b2c74445a9bc8f67fd9e306b
// flow-typed version: da30fe6876/react-dnd-html5-backend_v2.1.x/flow_>=v0.25.x

declare type $npm$reactDnd$NativeTypes$FILE = '__NATIVE_FILE__';
declare type $npm$reactDnd$NativeTypes$URL = '__NATIVE_URL__';
declare type $npm$reactDnd$NativeTypes$TEXT = '__NATIVE_TEXT__';
declare type $npm$reactDnd$NativeTypes =
  | $npm$reactDnd$NativeTypes$FILE
  | $npm$reactDnd$NativeTypes$URL
  | $npm$reactDnd$NativeTypes$TEXT;

declare module 'react-dnd-html5-backend' {
  declare module.exports: {
    getEmptyImage(): Image,
    NativeTypes: {
      FILE: $npm$reactDnd$NativeTypes$FILE,
      URL: $npm$reactDnd$NativeTypes$URL,
      TEXT: $npm$reactDnd$NativeTypes$TEXT,
    },
  };
}
