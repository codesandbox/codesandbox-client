import * as ts from 'typescript/lib/tsserverlibrary';
export default interface TemplateContext {
    readonly typescript: typeof ts;
    /**
     * Name of the file the template is in.
     */
    readonly fileName: string;
    /**
     * Contents of the template string.
     *
     * Has substitutions already replaced.
     */
    readonly text: string;
    /**
     * Raw contents of the template string.
     *
     * Still has substitutions in place.
     */
    readonly rawText: string;
    /**
     * AST node.
     */
    readonly node: ts.TemplateLiteral;
    /**
     * Map a location from within the template string to an offset within the template string
     */
    toOffset(location: ts.LineAndCharacter): number;
    /**
     * Map an offset within the template string to a location within the template string
     */
    toPosition(offset: number): ts.LineAndCharacter;
}
