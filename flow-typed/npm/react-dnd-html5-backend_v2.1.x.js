// flow-typed signature: 7c9e72cf66413ff1757b6c43ed9e26e2
// flow-typed version: b43dff3e0e/react-dnd-html5-backend_v2.1.x/flow_>=v0.15.x

declare type $npm$reactDnd$NativeTypes$FILE = '__NATIVE_FILE__';
declare type $npm$reactDnd$NativeTypes$URL = '__NATIVE_URL__';
declare type $npm$reactDnd$NativeTypes$TEXT = '__NATIVE_TEXT__';
declare type $npm$reactDnd$NativeTypes =
  | $npm$reactDnd$NativeTypes$FILE
  | $npm$reactDnd$NativeTypes$URL
  | $npm$reactDnd$NativeTypes$TEXT;

declare module 'react-dnd-html5-backend' {
  declare var exports: {
    getEmptyImage(): Image,
    NativeTypes: {
      FILE: $npm$reactDnd$NativeTypes$FILE,
      URL: $npm$reactDnd$NativeTypes$URL,
      TEXT: $npm$reactDnd$NativeTypes$TEXT,
    },
  };
}
