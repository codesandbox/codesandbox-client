/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { RawContextKey } from '../../contextkey/common/contextkey.js';
export function bindContextScopedWidget(contextKeyService, widget, contextKey) {
    new RawContextKey(contextKey, widget).bindTo(contextKeyService);
}
export function createWidgetScopedContextKeyService(contextKeyService, widget) {
    return contextKeyService.createScoped(widget.target);
}
export function getContextScopedWidget(contextKeyService, contextKey) {
    return contextKeyService.getContext(document.activeElement).getValue(contextKey);
}
