import {
  GraphQLSchema,
  GraphQLError,
  FragmentDefinitionNode,
  findDeprecatedUsages,
  isExecutableDefinitionNode
} from "graphql";

import { Diagnostic, DiagnosticSeverity } from "vscode-languageserver";

import { GraphQLDocument } from "./document";
import { highlightNodeForNode } from "./utilities/graphql";
import { rangeForASTNode } from "./utilities/source";

import { getValidationErrors } from "./errors/validation";
import { DocumentUri } from "./project/base";
import { ValidationRule } from "graphql/validation/ValidationContext";

/**
 * Build an array of code diagnostics for all executable definitions in a document.
 */
export function collectExecutableDefinitionDiagnositics(
  schema: GraphQLSchema,
  queryDocument: GraphQLDocument,
  fragments: { [fragmentName: string]: FragmentDefinitionNode } = {},
  rules?: ValidationRule[]
): Diagnostic[] {
  const ast = queryDocument.ast;
  if (!ast) return queryDocument.syntaxErrors;

  const astWithExecutableDefinitions = {
    ...ast,
    definitions: ast.definitions.filter(isExecutableDefinitionNode)
  };

  const diagnostics = [];

  for (const error of getValidationErrors(
    schema,
    astWithExecutableDefinitions,
    fragments,
    rules
  )) {
    diagnostics.push(
      ...diagnosticsFromError(error, DiagnosticSeverity.Error, "Validation")
    );
  }

  for (const error of findDeprecatedUsages(
    schema,
    astWithExecutableDefinitions
  )) {
    diagnostics.push(
      ...diagnosticsFromError(error, DiagnosticSeverity.Warning, "Deprecation")
    );
  }

  return diagnostics;
}

export function diagnosticsFromError(
  error: GraphQLError,
  severity: DiagnosticSeverity,
  type: string
): Diagnostic[] {
  if (!error.nodes) {
    return [];
  }

  return error.nodes.map(node => {
    return {
      source: `GraphQL: ${type}`,
      message: error.message,
      severity,
      range: rangeForASTNode(highlightNodeForNode(node) || node)
    };
  });
}

export class DiagnosticSet {
  private diagnosticsByFile = new Map<DocumentUri, Diagnostic[]>();

  entries() {
    return this.diagnosticsByFile.entries();
  }

  addDiagnostics(uri: DocumentUri, diagnostics: Diagnostic[]) {
    const existingDiagnostics = this.diagnosticsByFile.get(uri);
    if (!existingDiagnostics) {
      this.diagnosticsByFile.set(uri, diagnostics);
    } else {
      existingDiagnostics.push(...diagnostics);
    }
  }
}
