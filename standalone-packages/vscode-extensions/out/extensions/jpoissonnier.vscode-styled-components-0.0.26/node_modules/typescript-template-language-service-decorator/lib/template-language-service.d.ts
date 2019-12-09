import TemplateContext from './template-context';
/**
 * Augments TypeScript with language support for a language embedded in a template string.
 */
export default interface TemplateLanguageService {
    getCompletionsAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.CompletionInfo;
    getCompletionEntryDetails?(context: TemplateContext, position: ts.LineAndCharacter, name: string): ts.CompletionEntryDetails;
    getQuickInfoAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.QuickInfo | undefined;
    getSyntacticDiagnostics?(context: TemplateContext): ts.Diagnostic[];
    getSemanticDiagnostics?(context: TemplateContext): ts.Diagnostic[];
    getFormattingEditsForRange?(context: TemplateContext, start: number, end: number, settings: ts.EditorSettings): ts.TextChange[];
    getSupportedCodeFixes?(): number[];
    getCodeFixesAtPosition?(context: TemplateContext, start: number, end: number, errorCodes: ReadonlyArray<number>, formatOptions: ts.FormatCodeSettings): Array<ts.CodeAction | ts.CodeFixAction>;
    getDefinitionAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.DefinitionInfo[];
    getSignatureHelpItemsAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.SignatureHelpItems | undefined;
    getOutliningSpans?(context: TemplateContext): ts.OutliningSpan[];
    getReferencesAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.ReferenceEntry[] | undefined;
    getJsxClosingTagAtPosition?(context: TemplateContext, position: ts.LineAndCharacter): ts.JsxClosingTagInfo | undefined;
}
