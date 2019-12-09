/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {NestedEventListenerOrEventListenerObject, patchEventTargetMethods} from '../common/utils';

((_global: any) => {
  // patch MediaQuery
  patchMediaQuery(_global);

  function patchMediaQuery(_global: any) {
    if (!_global['MediaQueryList']) {
      return;
    }
    patchEventTargetMethods(
        _global['MediaQueryList'].prototype, 'addListener', 'removeListener', (self, args) => {
          return {
            useCapturing: false,
            eventName: 'mediaQuery',
            handler: args[0],
            target: self || _global,
            name: 'mediaQuery',
            invokeAddFunc: function(
                addFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) {
              if (delegate && (<Task>delegate).invoke) {
                return this.target[addFnSymbol]((<Task>delegate).invoke);
              } else {
                return this.target[addFnSymbol](delegate);
              }
            },
            invokeRemoveFunc: function(
                removeFnSymbol: any, delegate: Task|NestedEventListenerOrEventListenerObject) {
              if (delegate && (<Task>delegate).invoke) {
                return this.target[removeFnSymbol]((<Task>delegate).invoke);
              } else {
                return this.target[removeFnSymbol](delegate);
              }
            }
          };
        });
  }
})(typeof window === 'object' && window || typeof self === 'object' && self || global);