/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var CharWidthRequest = /** @class */ (function () {
    function CharWidthRequest(chr, type) {
        this.chr = chr;
        this.type = type;
        this.width = 0;
    }
    CharWidthRequest.prototype.fulfill = function (width) {
        this.width = width;
    };
    return CharWidthRequest;
}());
export { CharWidthRequest };
var DomCharWidthReader = /** @class */ (function () {
    function DomCharWidthReader(bareFontInfo, requests) {
        this._bareFontInfo = bareFontInfo;
        this._requests = requests;
        this._container = null;
        this._testElements = null;
    }
    DomCharWidthReader.prototype.read = function () {
        // Create a test container with all these test elements
        this._createDomElements();
        // Add the container to the DOM
        document.body.appendChild(this._container);
        // Read character widths
        this._readFromDomElements();
        // Remove the container from the DOM
        document.body.removeChild(this._container);
        this._container = null;
        this._testElements = null;
    };
    DomCharWidthReader.prototype._createDomElements = function () {
        var container = document.createElement('div');
        container.style.position = 'absolute';
        container.style.top = '-50000px';
        container.style.width = '50000px';
        var regularDomNode = document.createElement('div');
        regularDomNode.style.fontFamily = this._bareFontInfo.fontFamily;
        regularDomNode.style.fontWeight = this._bareFontInfo.fontWeight;
        regularDomNode.style.fontSize = this._bareFontInfo.fontSize + 'px';
        regularDomNode.style.lineHeight = this._bareFontInfo.lineHeight + 'px';
        regularDomNode.style.letterSpacing = this._bareFontInfo.letterSpacing + 'px';
        container.appendChild(regularDomNode);
        var boldDomNode = document.createElement('div');
        boldDomNode.style.fontFamily = this._bareFontInfo.fontFamily;
        boldDomNode.style.fontWeight = 'bold';
        boldDomNode.style.fontSize = this._bareFontInfo.fontSize + 'px';
        boldDomNode.style.lineHeight = this._bareFontInfo.lineHeight + 'px';
        boldDomNode.style.letterSpacing = this._bareFontInfo.letterSpacing + 'px';
        container.appendChild(boldDomNode);
        var italicDomNode = document.createElement('div');
        italicDomNode.style.fontFamily = this._bareFontInfo.fontFamily;
        italicDomNode.style.fontWeight = this._bareFontInfo.fontWeight;
        italicDomNode.style.fontSize = this._bareFontInfo.fontSize + 'px';
        italicDomNode.style.lineHeight = this._bareFontInfo.lineHeight + 'px';
        italicDomNode.style.letterSpacing = this._bareFontInfo.letterSpacing + 'px';
        italicDomNode.style.fontStyle = 'italic';
        container.appendChild(italicDomNode);
        var testElements = [];
        for (var i = 0, len = this._requests.length; i < len; i++) {
            var request = this._requests[i];
            var parent_1 = void 0;
            if (request.type === 0 /* Regular */) {
                parent_1 = regularDomNode;
            }
            if (request.type === 2 /* Bold */) {
                parent_1 = boldDomNode;
            }
            if (request.type === 1 /* Italic */) {
                parent_1 = italicDomNode;
            }
            parent_1.appendChild(document.createElement('br'));
            var testElement = document.createElement('span');
            DomCharWidthReader._render(testElement, request);
            parent_1.appendChild(testElement);
            testElements[i] = testElement;
        }
        this._container = container;
        this._testElements = testElements;
    };
    DomCharWidthReader._render = function (testElement, request) {
        if (request.chr === ' ') {
            var htmlString = '&nbsp;';
            // Repeat character 256 (2^8) times
            for (var i = 0; i < 8; i++) {
                htmlString += htmlString;
            }
            testElement.innerHTML = htmlString;
        }
        else {
            var testString = request.chr;
            // Repeat character 256 (2^8) times
            for (var i = 0; i < 8; i++) {
                testString += testString;
            }
            testElement.textContent = testString;
        }
    };
    DomCharWidthReader.prototype._readFromDomElements = function () {
        for (var i = 0, len = this._requests.length; i < len; i++) {
            var request = this._requests[i];
            var testElement = this._testElements[i];
            request.fulfill(testElement.offsetWidth / 256);
        }
    };
    return DomCharWidthReader;
}());
export function readCharWidths(bareFontInfo, requests) {
    var reader = new DomCharWidthReader(bareFontInfo, requests);
    reader.read();
}
