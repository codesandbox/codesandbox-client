import { analyzeProps } from './component-instance';

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

  const result = analyzeProps(code, {
    startLineNumber: 12,
    endLineNumber: 19,
    startColumnNumber: 0,
    endColumnNumber: 0,
  });

  expect(result.props).toMatchSnapshot();
});

it('can find props with children', () => {
  const code = `
  <Button>
    <Input className="test" />
  </Button>
`.trim();

  const result = analyzeProps(code, {
    startLineNumber: 0,
    endLineNumber: 4,
    startColumnNumber: 0,
    endColumnNumber: 0,
  });

  expect(Object.keys(result.props)).toEqual([]);
});

it('can find props from children', () => {
  const code = `<Input><Button className="test" /></Input>`.trim();

  const result = analyzeProps(code, {
    startLineNumber: 1,
    endLineNumber: 1,
    startColumnNumber: 7,
    endColumnNumber: 33,
  });

  expect(Object.keys(result.props)).toEqual(['className']);
});
