import ts from 'monaco-editor/min/vs/language/typescript/lib/typescriptServices';

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code, title, version } = event.data;
  try {
    const classifications = [];
    const sourceFile = ts.createSourceFile(
      title,
      code,
      ts.ScriptTarget.ES6,
      true,
    );
    const lines = code.split('\n').map(line => line.length);

    function getLineNumberAndOffset(start) {
      let line = 0;
      let offset = 0;
      while (offset + lines[line] <= start) {
        offset += lines[line] + 1;
        line += 1;
      }

      return { line: line + 1, offset };
    }

    function addChildNodes(node) {
      ts.forEachChild(node, id => {
        const { offset, line: startLine } = getLineNumberAndOffset(
          id.getStart(),
        );
        const { line: endLine } = getLineNumberAndOffset(id.getEnd());
        classifications.push({
          start: id.getStart() + 1 - offset,
          end: id.getEnd() + 1 - offset,
          kind: ts.SyntaxKind[id.kind],
          node: id,
          startLine,
          endLine,
        });

        addChildNodes(id);
      });
    }

    addChildNodes(sourceFile);

    self.postMessage({ classifications, version });
  } catch (e) {
    /* Ignore error */
  }
});
