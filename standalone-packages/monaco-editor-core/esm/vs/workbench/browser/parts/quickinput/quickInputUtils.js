/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './quickInput.css';
import * as dom from '../../../../base/browser/dom';
import { IdGenerator } from '../../../../base/common/idGenerator';
var iconPathToClass = {};
var iconClassGenerator = new IdGenerator('quick-input-button-icon-');
export function getIconClass(iconPath) {
    var iconClass;
    var key = iconPath.dark.toString();
    if (iconPathToClass[key]) {
        iconClass = iconPathToClass[key];
    }
    else {
        iconClass = iconClassGenerator.nextId();
        dom.createCSSRule("." + iconClass, "background-image: url(\"" + (iconPath.light || iconPath.dark).toString() + "\")");
        dom.createCSSRule(".vs-dark ." + iconClass + ", .hc-black ." + iconClass, "background-image: url(\"" + iconPath.dark.toString() + "\")");
        iconPathToClass[key] = iconClass;
    }
    return iconClass;
}
