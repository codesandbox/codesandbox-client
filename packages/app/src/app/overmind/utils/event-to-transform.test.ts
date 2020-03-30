import eventToTransform from './event-to-transform';

describe('Live', () => {
  describe('Monaco Event to OT Transform', () => {
    it.only("doesn't make the retain too long", () => {
      const code1 =
        'import React, { Component } from "react";\n\nexport default class Search extends Component{\n  state = {\n    initialItems: [],\n    items: []\n  }\n\n  filterList = (event) => {\n    let items = this.state.initialItems;\n    items = items.filter((item) => {\n      return item.toLowerCase()\n    });\n  }\n}';

      const event1 = {
        changes: [
          {
            range: {
              startLineNumber: 12,
              startColumn: 33,
              endLineNumber: 12,
              endColumn: 33,
            },
            rangeLength: 0,
            text: 's',
            rangeOffset: 281,
            forceMoveMarkers: false,
          },
        ],
        eol: '\n',
        versionId: 357,
        isUndoing: false,
        isRedoing: false,
        isFlush: false,
      };

      const res = eventToTransform(event1, code1);

      console.log(res.operation);

      const code =
        'import React, { Component } from "react";\n\nexport default class Search extends Component{\n  state = {\n    initialItems: [],\n    items: []\n  }\n\n  filterList = (event) => {\n    let items = this.state.initialItems;\n    items = items.filter((item) => {\n      return item.toLowerCase().s\n    });\n  }\n}';

      const event = {
        changes: [
          {
            range: {
              startLineNumber: 12,
              startColumn: 34,
              endLineNumber: 12,
              endColumn: 34,
            },
            rangeLength: 0,
            text: 'e',
            rangeOffset: 282,
            forceMoveMarkers: false,
          },
        ],
        eol: '\n',
        versionId: 358,
        isUndoing: false,
        isRedoing: false,
        isFlush: false,
      };

      const { operation, newCode } = eventToTransform(event, code);

      console.log(getTextOperation(code1, code));
      console.log(code1.length);
      console.log(code.length);

      console.log(operation);

      expect(operation.apply(code)).toBe(newCode);
    });

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
