/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import {patchOnProperties} from '../common/utils';

((_global: any) => {
  // patch Notification
  patchNotification(_global);

  function patchNotification(_global: any) {
    const Notification = _global['Notification'];
    if (!Notification || !Notification.prototype) {
      return;
    }

    patchOnProperties(Notification.prototype, null);
  }
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
