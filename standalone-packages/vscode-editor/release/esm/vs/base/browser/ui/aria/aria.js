/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './aria.css';
import * as nls from '../../../../nls.js';
import { isMacintosh } from '../../../common/platform.js';
import * as dom from '../../dom.js';
var ariaContainer;
var alertContainer;
var statusContainer;
export function setARIAContainer(parent) {
    ariaContainer = document.createElement('div');
    ariaContainer.className = 'monaco-aria-container';
    alertContainer = document.createElement('div');
    alertContainer.className = 'monaco-alert';
    alertContainer.setAttribute('role', 'alert');
    alertContainer.setAttribute('aria-atomic', 'true');
    ariaContainer.appendChild(alertContainer);
    statusContainer = document.createElement('div');
    statusContainer.className = 'monaco-status';
    statusContainer.setAttribute('role', 'status');
    statusContainer.setAttribute('aria-atomic', 'true');
    ariaContainer.appendChild(statusContainer);
    parent.appendChild(ariaContainer);
}
/**
 * Given the provided message, will make sure that it is read as alert to screen readers.
 */
export function alert(msg) {
    insertMessage(alertContainer, msg);
}
/**
 * Given the provided message, will make sure that it is read as status to screen readers.
 */
export function status(msg) {
    if (isMacintosh) {
        alert(msg); // VoiceOver does not seem to support status role
    }
    else {
        insertMessage(statusContainer, msg);
    }
}
var repeatedTimes = 0;
var prevText = undefined;
function insertMessage(target, msg) {
    if (!ariaContainer) {
        // console.warn('ARIA support needs a container. Call setARIAContainer() first.');
        return;
    }
    if (prevText === msg) {
        repeatedTimes++;
    }
    else {
        prevText = msg;
        repeatedTimes = 0;
    }
    switch (repeatedTimes) {
        case 0: break;
        case 1:
            msg = nls.localize('repeated', "{0} (occurred again)", msg);
            break;
        default:
            msg = nls.localize('repeatedNtimes', "{0} (occurred {1} times)", msg, repeatedTimes);
            break;
    }
    dom.clearNode(target);
    target.textContent = msg;
    // See https://www.paciellogroup.com/blog/2012/06/html5-accessibility-chops-aria-rolealert-browser-support/
    target.style.visibility = 'hidden';
    target.style.visibility = 'visible';
}
