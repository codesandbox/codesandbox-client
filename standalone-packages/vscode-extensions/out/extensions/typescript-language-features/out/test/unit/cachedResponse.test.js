"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
require("mocha");
const vscode = require("vscode");
const cachedResponse_1 = require("../../tsServer/cachedResponse");
const typescriptService_1 = require("../../typescriptService");
suite('CachedResponse', () => {
    test('should cache simple response for same document', async () => {
        const doc = await createTextDocument();
        const response = new cachedResponse_1.CachedResponse();
        assertResult(await response.execute(doc, respondWith('test-0')), 'test-0');
        assertResult(await response.execute(doc, respondWith('test-1')), 'test-0');
    });
    test('should invalidate cache for new document', async () => {
        const doc1 = await createTextDocument();
        const doc2 = await createTextDocument();
        const response = new cachedResponse_1.CachedResponse();
        assertResult(await response.execute(doc1, respondWith('test-0')), 'test-0');
        assertResult(await response.execute(doc1, respondWith('test-1')), 'test-0');
        assertResult(await response.execute(doc2, respondWith('test-2')), 'test-2');
        assertResult(await response.execute(doc2, respondWith('test-3')), 'test-2');
        assertResult(await response.execute(doc1, respondWith('test-4')), 'test-4');
        assertResult(await response.execute(doc1, respondWith('test-5')), 'test-4');
    });
    test('should not cache cancelled responses', async () => {
        const doc = await createTextDocument();
        const response = new cachedResponse_1.CachedResponse();
        const cancelledResponder = createEventualResponder();
        const result1 = response.execute(doc, () => cancelledResponder.promise);
        const result2 = response.execute(doc, respondWith('test-0'));
        const result3 = response.execute(doc, respondWith('test-1'));
        cancelledResponder.resolve(new typescriptService_1.ServerResponse.Cancelled('cancelled'));
        assert.strictEqual((await result1).type, 'cancelled');
        assertResult(await result2, 'test-0');
        assertResult(await result3, 'test-0');
    });
    test('should not care if subsequent requests are cancelled if first request is resolved ok', async () => {
        const doc = await createTextDocument();
        const response = new cachedResponse_1.CachedResponse();
        const cancelledResponder = createEventualResponder();
        const result1 = response.execute(doc, respondWith('test-0'));
        const result2 = response.execute(doc, () => cancelledResponder.promise);
        const result3 = response.execute(doc, respondWith('test-1'));
        cancelledResponder.resolve(new typescriptService_1.ServerResponse.Cancelled('cancelled'));
        assertResult(await result1, 'test-0');
        assertResult(await result2, 'test-0');
        assertResult(await result3, 'test-0');
    });
    test('should not cache cancelled responses with document changes', async () => {
        const doc1 = await createTextDocument();
        const doc2 = await createTextDocument();
        const response = new cachedResponse_1.CachedResponse();
        const cancelledResponder = createEventualResponder();
        const cancelledResponder2 = createEventualResponder();
        const result1 = response.execute(doc1, () => cancelledResponder.promise);
        const result2 = response.execute(doc1, respondWith('test-0'));
        const result3 = response.execute(doc1, respondWith('test-1'));
        const result4 = response.execute(doc2, () => cancelledResponder2.promise);
        const result5 = response.execute(doc2, respondWith('test-2'));
        const result6 = response.execute(doc1, respondWith('test-3'));
        cancelledResponder.resolve(new typescriptService_1.ServerResponse.Cancelled('cancelled'));
        cancelledResponder2.resolve(new typescriptService_1.ServerResponse.Cancelled('cancelled'));
        assert.strictEqual((await result1).type, 'cancelled');
        assertResult(await result2, 'test-0');
        assertResult(await result3, 'test-0');
        assert.strictEqual((await result4).type, 'cancelled');
        assertResult(await result5, 'test-2');
        assertResult(await result6, 'test-3');
    });
});
function respondWith(command) {
    return async () => createResponse(command);
}
function createTextDocument() {
    return vscode.workspace.openTextDocument({ language: 'javascript', content: '' });
}
function assertResult(result, command) {
    if (result.type === 'response') {
        assert.strictEqual(result.command, command);
    }
    else {
        assert.fail('Response failed');
    }
}
function createResponse(command) {
    return {
        type: 'response',
        body: {},
        command: command,
        request_seq: 1,
        success: true,
        seq: 1
    };
}
function createEventualResponder() {
    let resolve;
    const promise = new Promise(r => { resolve = r; });
    return { promise, resolve: resolve };
}
//# sourceMappingURL=cachedResponse.test.js.map