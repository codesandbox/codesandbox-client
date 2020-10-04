import ts from 'typescript';
import { analyzeComponentInstances } from './component-instance';

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

  const result = analyzeComponentInstances(getAst(code), '/app.tsx');
  expect(result).toMatchSnapshot();
});

it('can find named imports', () => {
  const code = `
  import { Button } from './Button';
  <Button />
`.trim();

  const result = analyzeComponentInstances(getAst(code), 'app.tsx');

  expect(result[0].name).toBe('Button');
  expect(result[0].importLocation?.importName).toBe('Button');
  expect(result[0].importLocation?.importPath).toBe('./Button');
});

it('can find redirected imports', () => {
  const code = `import { Button } from './Button';
  
  const AnotherButton = Button;

  <AnotherButton />
  `;

  const result = analyzeComponentInstances(getAst(code), 'app.tsx');
  expect(result[0].name).toBe('AnotherButton');
  expect(result[0].importLocation?.importName).toBe('Button');
  expect(result[0].importLocation?.importPath).toBe('./Button');
});

it('can find aliased imports', () => {
  const code = `import { Button as AnotherButton } from './Button';

  <AnotherButton />
  `;

  const result = analyzeComponentInstances(getAst(code), 'app.tsx');
  expect(result[0].name).toBe('AnotherButton');
  expect(result[0].importLocation?.importName).toBe('Button');
  expect(result[0].importLocation?.importPath).toBe('./Button');
});
