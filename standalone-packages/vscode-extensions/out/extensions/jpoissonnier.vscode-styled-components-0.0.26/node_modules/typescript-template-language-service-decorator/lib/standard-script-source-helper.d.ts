import * as ts from 'typescript/lib/tsserverlibrary';
import ScriptSourceHelper from './script-source-helper';
export default class StandardScriptSourceHelper implements ScriptSourceHelper {
    private readonly typescript;
    private readonly project;
    constructor(typescript: typeof ts, project: ts.server.Project);
    getNode(fileName: string, position: number): ts.Node | undefined;
    getAllNodes(fileName: string, cond: (n: ts.Node) => boolean): ReadonlyArray<ts.Node>;
    getLineAndChar(fileName: string, position: number): ts.LineAndCharacter;
    getOffset(fileName: string, line: number, character: number): number;
    private getProgram;
    private getSourceFile;
}
