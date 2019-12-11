import eventToTransform from './event-to-transform';

describe('Live', () => {
  describe('Monaco Event to OT Transform', () => {
    it('correctly transforms undo of adding text', () => {
      const changeEvent = {
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

      const code = `import React from 'react';
import { render } from 'react-dom';
import Hello from './Hello';

const styles = {
  fontFamily: 'sans-serif',
  textAlign: 'center',
};

const App = () => (
  <div style={styles}>
    <Hello name="CodeSandbox" />
    <h2>Startaa editing to see some magic happen {"\u2728"}</h2>
  </div>
);
`;

      const { operation, newCode } = eventToTransform(changeEvent, code);

      expect(operation.apply(code)).toBe(`import React from 'react';
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
`);

      expect(operation.apply(code)).toBe(newCode);
    });

    it('correctly transforms undo of removing text', () => {
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

      const code = `import React from 'react';
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
`;

      const { operation, newCode } = eventToTransform(changeEvent, code);

      expect(operation.apply(code)).toBe(`import React from 'react';
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
`);

      expect(operation.apply(code)).toBe(newCode);
    });
  });
});
