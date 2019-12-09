import {
  DocumentFormattingEditProvider,
  Range,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  TextEdit,
} from 'vscode';

import format from'./format'

export function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  return new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

class PrismaEditProvider implements DocumentFormattingEditProvider {
    private exec_path: string

    constructor(exec_path) {
      this.exec_path = exec_path;
    }

    provideDocumentFormattingEdits(
        document: TextDocument,
        options: FormattingOptions,
        token: CancellationToken
    ): Promise<TextEdit[]> {
      return format(this.exec_path, options.tabSize, document.getText()).then((formatted) => 
        [TextEdit.replace(fullDocumentRange(document), formatted)]
      )
    }
}

export default PrismaEditProvider;