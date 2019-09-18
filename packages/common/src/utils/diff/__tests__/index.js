import * as diff from '..';

describe('Diffing', () => {
  it('can diff two strings', () => {
    expect(diff.findDiff('aaa', 'aba')).toMatchSnapshot();
    expect(diff.findDiff('aaaaa', 'aba')).toMatchSnapshot();
  });

  it('can generate an operation from a diff', () => {
    const textA = 'I like pizza';
    const textB = 'They like cookies';

    const op = diff.getTextOperation(textA, textB);

    expect(op.toJSON()).toMatchSnapshot();
    expect(op.apply(textA)).toBe('They like cookies');
  });

  it('can generate with many deletions', () => {
    const textA = 'I like pizza';
    const textB = ' I';

    const op = diff.getTextOperation(textA, textB);

    expect(op.toJSON()).toMatchSnapshot();
    expect(op.apply(textA)).toBe(' I');
  });

  it('can generate an operation on real code', () => {
    const textA = `
    import React from 'react'
    import ReactDOM from 'react-dom'

    import './styles.css'

    function App() {
      return (
        <div className="App">
          <h1>Hello wereld aa pok CodeSandbox</h1>

          <h2>Start editing to see some magic happen!</h2>
        </div>
      )
    }

    const rootElement = document.getElementById('root')
    ReactDOM.render(<App />, rootElement)
    `;
    const textB = `
    import React from "react";
    import ReactDOM from "react-dom";

    import "./styles.css";

    function App() {
      return (
        <div className="App">
          <h1>Hello wereld aa pok CodeSandbox</h1>

          <h2>Start editing to see some magic happen!</h2>
        </div>
      );
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App />, rootElement);
    `;

    const op = diff.getTextOperation(textA, textB);

    expect(op.toJSON()).toMatchSnapshot();
    expect(op.apply(textA)).toBe(textB);
  });

  it('can work with big files', () => {
    const A = Array.from({ length: 10000 })
      .map(() => 'a')
      .join('');
    const B = A.split('')
      .map((c, i) => (i > 2000 && i < 2050 ? 'b' : c))
      .join('');

    const op = diff.getTextOperation(A, B);

    expect(op.apply(A)).toEqual(B);
  });

  it('falls back to stupid diff really big files', () => {
    const A = Array.from({ length: 15000 })
      .map(() => 'a')
      .join('');
    const B = A.split('')
      .map((c, i) => (i > 2000 && i < 2050 ? 'b' : c))
      .join('');

    const op = diff.getTextOperation(A, B);

    expect(op).toMatchSnapshot();
    expect(op.apply(A)).toEqual(B);
  });
});
