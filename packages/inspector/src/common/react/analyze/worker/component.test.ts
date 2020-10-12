import ts from 'typescript';
import { analyzeComponent } from './component';

type Files = {
  [path: string]: string;
};

const createTestHost = (files: Files): ts.LanguageServiceHost => {
  const usedFiles: Files = {
    ...files,
    'lib.d.ts': '',
  };
  return {
    getCompilationSettings: () => ts.getDefaultCompilerOptions(),
    getScriptFileNames: () => Object.keys(usedFiles),
    getScriptVersion: () => '0',
    getScriptSnapshot: f => ts.ScriptSnapshot.fromString(usedFiles[f]),
    getCurrentDirectory: () => '/',
    getDefaultLibFileName: options => ts.getDefaultLibFileName(options),
    readFile: p => usedFiles[p],
  };
};

function analyzeFile(code: string, extraFiles = {}) {
  const files = {
    '/button.tsx': code,
    ...extraFiles,
  };

  const host = ts.createLanguageService(createTestHost(files));
  const sourceFile = host.getProgram()?.getSourceFile('/button.tsx');
  return analyzeComponent(
    sourceFile!,
    'default',
    host.getProgram()?.getTypeChecker()!
  );
}

describe('function component', () => {
  it('can parse props of a function component', () => {
    const result = analyzeFile(`
    import React from 'react';
  
    type Props = {
      label: string;
      padding?: number;
    }
    
    export default function Button(props: Props) {
      return <div> </div>
    }
    `)!;

    expect(result.props).toHaveLength(2);
    expect(result.props[0].name).toEqual('label');
    expect(result.props[0].required).toBeTruthy();
    expect(result.props[0].defaultValue).toBeUndefined();
    expect(result.props[1].name).toEqual('padding');
    expect(result.props[1].required).toBeFalsy();
    expect(result.props[1].defaultValue).toBeUndefined();
  });

  it('can parse default values', () => {
    const result = analyzeFile(`
    import React from 'react';
  
    type Props = {
      label: string;
      padding?: number;
      onClick: () => void;
      color: string;
    }
    
    export default function Button({ label = 'test', padding = 5, onClick = () => {} }: Props) {
      return <div> </div>
    }
    `)!;

    expect(result.props[0].name).toEqual('label');
    expect(result.props[0].defaultValue).toEqual({
      computed: false,
      value: "'test'",
    });
    expect(result.props[1].defaultValue).toEqual({
      computed: false,
      value: '5',
    });
    expect(result.props[2].defaultValue).toEqual({
      computed: true,
      value: '() => {}',
    });
    expect(result.props[3].defaultValue).toBeUndefined();
  });

  it('can parse descriptions and jsdoc', () => {
    const result = analyzeFile(`
    import React from 'react';
  
    type Props = {
      /**
       * The color of the component
       * @knob Test
       */
      color: string;
    }
    
    /**
     * Test Component
     * @knob Test
    */
    export default function Button(props: Props) {
      return <div> </div>
    }
    `)!;

    expect(result.descriptions).toEqual(['Test Component']);
    expect(result.jsdocTags).toEqual([{ name: 'knob', text: 'Test' }]);
    expect(result.props[0].descriptions).toEqual([
      'The color of the component',
    ]);
    expect(result.props[0].jsdocTags).toEqual([{ name: 'knob', text: 'Test' }]);
  });
});
