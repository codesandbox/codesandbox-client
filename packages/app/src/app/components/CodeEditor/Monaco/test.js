const TextOperation = require('ot').TextOperation;

function lineAndColumnToIndex(lines, lineNumber, column) {
  let currentLine = 0;
  let index = 0;

  while (currentLine + 1 < lineNumber) {
    index += lines[currentLine].length;
    index += 1; // Linebreak character
    currentLine += 1;
  }

  index += column - 1;

  return index;
}

const liveOperationCodeGoal = `import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = () => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Start editing to see some magic happen {"\u2728"}</h2>
  </div>
);

render(<App />, document.body);
`;

let liveOperationCode = `import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = () => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Sta editing to see some magic happen {"\u2728"}</h2>
  </div>
);

render(<App />, document.body);
`;

const changeEvent = {
  changes: [
    {
      range: {
        startLineNumber: 13,
        startColumn: 12,
        endLineNumber: 13,
        endColumn: 12,
      },
      rangeLength: 0,
      text: 'r',
      rangeOffset: 252,
      forceMoveMarkers: false,
    },
    {
      range: {
        startLineNumber: 13,
        startColumn: 13,
        endLineNumber: 13,
        endColumn: 13,
      },
      rangeLength: 0,
      text: 't',
      rangeOffset: 253,
      forceMoveMarkers: false,
    },
  ],
  eol: '\n',
  versionId: 9,
  isUndoing: true,
  isRedoing: false,
  isFlush: false,
};

const changeEvent2 = {
  changes: [
    {
      range: {
        startLineNumber: 13,
        startColumn: 15,
        endLineNumber: 13,
        endColumn: 16,
      },
      rangeLength: 1,
      text: '',
      rangeOffset: 255,
      forceMoveMarkers: false,
    },
    {
      range: {
        startLineNumber: 13,
        startColumn: 14,
        endLineNumber: 13,
        endColumn: 15,
      },
      rangeLength: 1,
      text: '',
      rangeOffset: 254,
      forceMoveMarkers: false,
    },
  ],
  eol: '\n',
  versionId: 5,
  isUndoing: true,
  isRedoing: false,
  isFlush: false,
};

function doIt() {
  let otOperation;

  // TODO: add a comment explaining what "delta" is
  let delta = 0;

  let composedCode = liveOperationCode;

  // eslint-disable-next-line no-restricted-syntax
  for (const change of [...changeEvent.changes]) {
    const newOt = new TextOperation();
    const cursorStartOffset = lineAndColumnToIndex(
      composedCode.split(/\r?\n/),
      change.range.startLineNumber,
      change.range.startColumn
    );

    const retain = cursorStartOffset - newOt.targetLength;

    if (retain !== 0) {
      newOt.retain(retain);
    }

    if (change.rangeLength > 0) {
      newOt.delete(change.rangeLength);
    }

    if (change.text) {
      const normalizedChangeText = change.text.split(/\r?\n/).join('\n');
      newOt.insert(normalizedChangeText);
    }

    const remaining = composedCode.length - newOt.baseLength;
    if (remaining > 0) {
      newOt.retain(remaining);
    }

    otOperation = otOperation ? otOperation.compose(newOt) : newOt;

    composedCode = otOperation.apply(liveOperationCode);
  }

  console.log(otOperation);

  console.log(otOperation.apply(liveOperationCode));

  console.log(otOperation.apply(liveOperationCode) === liveOperationCodeGoal);
  // sendTransforms(otOperation);

  // requestAnimationFrame(() => {
  //   liveOperationCode = '';
  // });
}

doIt();
