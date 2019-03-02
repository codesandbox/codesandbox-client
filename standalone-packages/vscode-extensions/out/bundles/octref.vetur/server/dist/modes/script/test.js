"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const path = require("path");
const glob = require("glob");
const fs = require("fs");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vscode_uri_1 = require("vscode-uri");
const javascript_1 = require("./javascript");
const languageModelCache_1 = require("../languageModelCache");
const embeddedSupport_1 = require("../embeddedSupport");
const workspace = path.resolve(__dirname, '../../../test/fixtures/');
const documentRegions = languageModelCache_1.getLanguageModelCache(10, 60, document => embeddedSupport_1.getDocumentRegions(document));
const scriptMode = javascript_1.getJavascriptMode(documentRegions, workspace);
suite('integrated test', () => {
    const filenames = glob.sync(workspace + '/**/*.vue');
    for (const filename of filenames) {
        const doc = createTextDocument(filename);
        const diagnostics = scriptMode.doValidation(doc);
        test('validate: ' + path.basename(filename), () => {
            assert(diagnostics.length === 0);
        });
        if (filename.endsWith('app.vue')) {
            const components = scriptMode.findComponents(doc);
            test('props collection', testProps.bind(null, components));
        }
    }
});
function testProps(components) {
    assert.equal(components.length, 4, 'component number');
    const comp = components[0];
    const comp2 = components[1];
    const comp3 = components[2];
    const comp4 = components[3];
    assert.equal(comp.name, 'comp', 'component name');
    assert.equal(comp2.name, 'comp2', 'component name');
    assert.deepEqual(comp.props, [{ name: 'propname' }, { name: 'another-prop' }]);
    assert.deepEqual(comp2.props, [
        { name: 'propname', doc: 'String' },
        { name: 'weird-prop', doc: '' },
        { name: 'another-prop', doc: 'type: Number' }
    ]);
    assert.deepEqual(comp3.props, [{ name: 'inline' }]);
    assert.deepEqual(comp4.props, [{ name: 'inline', doc: 'Number' }]);
}
function createTextDocument(filename) {
    const uri = vscode_uri_1.default.file(filename).toString();
    const content = fs.readFileSync(filename, 'utf-8');
    return vscode_languageserver_types_1.TextDocument.create(uri, 'vue', 0, content);
}
//# sourceMappingURL=test.js.map