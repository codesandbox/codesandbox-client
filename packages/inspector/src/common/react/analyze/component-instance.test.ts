import ts from 'typescript';
import { analyzeProps } from './component-instance';

function getAst(code: string) {
  return ts.createSourceFile('App.tsx', code, ts.ScriptTarget.Latest, true);
}

it('can find props', () => {
  const code = `
  import React from "react";

  import "./styles.css";
  import Input from "./Input";
  import Button from "./Button";
  
  export default function App() {
    return (
      <div className="App">
        <Input />
        <div>
          <Button
            variant={"primary"}
            label="Hello World"
            padding={5}
            onClick={() => {
              console.log("test");
            }}
          />
          <Button />
        </div>
      </div>
    );
  }
  `.trim();

  const result = analyzeProps(getAst(code), {
    startLineNumber: 12,
    endLineNumber: 19,
    startColumnNumber: 11,
    endColumnNumber: 13,
  });

  expect(result.props).toMatchSnapshot();
});

it('can find props with children', () => {
  const code = `
  <Button>
    <Input className="test" />
  </Button>
`.trim();

  const result = analyzeProps(getAst(code), {
    startLineNumber: 1,
    endLineNumber: 1,
    startColumnNumber: 1,
    endColumnNumber: 9,
  });

  expect(Object.keys(result.props)).toEqual([]);
});

it('can find props from children', () => {
  const code = `<Input><Button className="test" /></Input>`.trim();

  const result = analyzeProps(getAst(code), {
    startLineNumber: 1,
    endLineNumber: 1,
    startColumnNumber: 8,
    endColumnNumber: 35,
  });

  expect(Object.keys(result.props)).toEqual(['className']);
});
