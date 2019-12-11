import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import { Sandbox } from '@codesandbox/common/lib/types';
import { lineAndColumnToIndex } from 'app/overmind/utils/common';

export function getVSCodePath(sandbox: Sandbox, moduleId: string) {
  return `/sandbox${getModulePath(
    sandbox.modules,
    sandbox.directories,
    moduleId
  )}`;
}

export function getCurrentModelPath(editor) {
  const activeEditor = editor.getActiveCodeEditor();

  if (!activeEditor) {
    return undefined;
  }

  const model = activeEditor.getModel();

  if (!model) {
    return undefined;
  }

  return model.uri.path.replace(/^\/sandbox/, '');
}

export function getCurrentModel(editor) {
  const activeEditor = editor.getActiveCodeEditor();

  return activeEditor && activeEditor.getModel();
}

export function getSelection(lines, selection) {
  const startSelection = lineAndColumnToIndex(
    lines,
    selection.startLineNumber,
    selection.startColumn
  );
  const endSelection = lineAndColumnToIndex(
    lines,
    selection.endLineNumber,
    selection.endColumn
  );

  return {
    selection:
      startSelection === endSelection ? [] : [startSelection, endSelection],
    cursorPosition: lineAndColumnToIndex(
      lines,
      selection.positionLineNumber,
      selection.positionColumn
    ),
  };
}
