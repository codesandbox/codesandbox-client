self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/2.4.2/typescript.min.js',
]);

function getLineNumberAndOffset(start, lines) {
  let line = 0;
  let offset = 0;
  while (offset + lines[line] < start) {
    offset += lines[line] + 1;
    line += 1;
  }

  return { line: line + 1, offset };
}

function nodeToRange(node) {
  if (
    typeof node.getStart === 'function' &&
    typeof node.getEnd === 'function'
  ) {
    return [node.getStart(), node.getEnd()];
  } else if (
    typeof node.pos !== 'undefined' &&
    typeof node.end !== 'undefined'
  ) {
    return [node.pos, node.end];
  }
  return [0, 0];
}

function getNodeType(parent, node) {
  return Object.keys(parent).find(key => parent[key] === node);
}

function getParentRanges(node) {
  const ranges = [];
  const [start, end] = nodeToRange(node);
  let lastEnd = start;

  self.ts.forEachChild(node, child => {
    const [start, end] = nodeToRange(child);

    ranges.push({
      start: lastEnd,
      end: start,
    });
    lastEnd = end;
  });

  if (lastEnd !== end) {
    ranges.push({
      start: lastEnd,
      end,
    });
  }

  return ranges;
}

function addChildNodes(node, lines, classifications) {
  const parentKind = ts.SyntaxKind[node.kind];

  self.ts.forEachChild(node, id => {
    const type = getNodeType(node, id);

    classifications.push(
      ...getParentRanges(id).map(({ start, end }) => {
        const { offset, line: startLine } = getLineNumberAndOffset(
          start,
          lines
        );
        const { line: endLine } = getLineNumberAndOffset(end, lines);

        return {
          start: start + 1 - offset,
          end: end + 1 - offset,
          kind: ts.SyntaxKind[id.kind],
          parentKind,
          type,
          startLine,
          endLine,
        };
      })
    );

    addChildNodes(id, lines, classifications);
  });
}

// Respond to message from parent thread
self.addEventListener('message', event => {
  const { code, title, version } = event.data;
  try {
    const classifications = [];
    const sourceFile = self.ts.createSourceFile(
      title,
      code,
      self.ts.ScriptTarget.ES6,
      true
    );
    const lines = code.split('\n').map(line => line.length);

    addChildNodes(sourceFile, lines, classifications);

    self.postMessage({ classifications, version });
  } catch (e) {
    /* Ignore error */
  }
});
