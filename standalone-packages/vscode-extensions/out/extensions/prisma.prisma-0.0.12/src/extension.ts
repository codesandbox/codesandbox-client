import * as vscode from 'vscode';
import PrismaEditProvider, { fullDocumentRange } from './provider'
import * as path from 'path'
import * as fs from 'fs'
import install from './install'
import lint from './lint';

const exec_path = path.join(__dirname, '../prisma-fmt')

export async function activate(context: vscode.ExtensionContext) {
  if(!fs.existsSync(exec_path)) {
    try {
      await install(exec_path)
      vscode.window.showInformationMessage("Prisma plugin installation succeeded.")
    } catch (err) {
      // No error on install error.
      // vscode.window.showErrorMessage("Cannot install prisma-fmt: " + err)
    }
  }

  if(fs.existsSync(exec_path)) {
    // This registers our formatter, prisma-fmt
    vscode.languages.registerDocumentFormattingEditProvider('prisma', new PrismaEditProvider(exec_path)) 

    // This registers our linter, also prisma-fmt for now.
    const collection = vscode.languages.createDiagnosticCollection('prisma');

    vscode.workspace.onDidChangeTextDocument(async(e) => {
      await updatePrismaDiagnostics(e.document, collection);
    })
    if (vscode.window.activeTextEditor) {
      await updatePrismaDiagnostics(vscode.window.activeTextEditor.document, collection);
    }
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(async editor => {
      if (editor) {
        await updatePrismaDiagnostics(editor.document, collection);
      }
    }));
  }
}

async function updatePrismaDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
	if (document && document.languageId === 'prisma') {
    const text = document.getText(fullDocumentRange(document))

    const res = await lint(exec_path, text);

    const errors = []
    
    for(const error of res) {
      errors.push({
        code: '',
        message: error.text,
        range: new vscode.Range(document.positionAt(error.start), document.positionAt(error.end)),
        severity: vscode.DiagnosticSeverity.Error,
        source: '',
        relatedInformation: []
      })
    }
    collection.set(document.uri, errors)
	} else {
		collection.clear();
	}
}

