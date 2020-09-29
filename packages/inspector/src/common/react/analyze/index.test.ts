import { parse } from '@babel/parser';
import { analyzeProps } from '.';

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

  const a = Date.now();
  const parsed = parse(code, {
    sourceType: 'module',
    plugins: ['jsx', 'typescript'],
    ranges: true,
  });

  console.log(
    analyzeProps(parsed, {
      startLineNumber: 12,
      endLineNumber: 19,
      startColumnNumber: 0,
      endColumnNumber: 0,
    })
  );
  console.log(Date.now() - a);
});
