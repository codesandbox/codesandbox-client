import * as ts from 'typescript/lib/tsserverlibrary';
export declare function relative(from: ts.LineAndCharacter, to: ts.LineAndCharacter): ts.LineAndCharacter;
export declare function findNode(typescript: typeof ts, sourceFile: ts.SourceFile, position: number): ts.Node | undefined;
export declare function findAllNodes(typescript: typeof ts, sourceFile: ts.SourceFile, cond: (n: ts.Node) => boolean): ReadonlyArray<ts.Node>;
export declare function isTaggedLiteral(typescript: typeof ts, node: ts.NoSubstitutionTemplateLiteral, tags: ReadonlyArray<string>): boolean;
export declare function isTagged(node: ts.TaggedTemplateExpression, tags: ReadonlyArray<string>): boolean;
