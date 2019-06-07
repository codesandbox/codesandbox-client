import { extname } from "path";
import { readFileSync } from "fs";
import URI from "vscode-uri";

import {
  TypeSystemDefinitionNode,
  isTypeSystemDefinitionNode,
  TypeSystemExtensionNode,
  isTypeSystemExtensionNode,
  DefinitionNode,
  GraphQLSchema
} from "graphql";

import {
  TextDocument,
  NotificationHandler,
  PublishDiagnosticsParams,
  Position
} from "vscode-languageserver";

import { GraphQLDocument, extractGraphQLDocuments } from "../document";

import { LoadingHandler } from "../loadingHandler";
import { FileSet } from "../fileSet";
import { ApolloConfig } from "../config";
import {
  schemaProviderFromConfig,
  GraphQLSchemaProvider,
  SchemaResolveConfig
} from "../providers/schema";
import { ApolloEngineClient, ClientIdentity } from "../engine";

export type DocumentUri = string;

const fileAssociations: { [extension: string]: string } = {
  ".graphql": "graphql",
  ".gql": "graphql",
  ".js": "javascript",
  ".ts": "typescript",
  ".jsx": "javascriptreact",
  ".tsx": "typescriptreact",
  ".vue": "vue",
  ".py": "python"
};

export interface GraphQLProjectConfig {
  clientIdentity?: ClientIdentity;
  config: ApolloConfig;
  fileSet: FileSet;
  loadingHandler: LoadingHandler;
}

export interface TypeStats {
  service?: number;
  client?: number;
  total?: number;
}

export interface ProjectStats {
  type: string;
  loaded: boolean;
  serviceId?: string;
  types?: TypeStats;
  tag?: string;
  lastFetch?: number;
}

export abstract class GraphQLProject implements GraphQLSchemaProvider {
  public schemaProvider: GraphQLSchemaProvider;
  protected _onDiagnostics?: NotificationHandler<PublishDiagnosticsParams>;

  private _isReady: boolean;
  private readyPromise: Promise<void>;
  protected engineClient?: ApolloEngineClient;

  private needsValidation = false;

  protected documentsByFile: Map<DocumentUri, GraphQLDocument[]> = new Map();

  public config: ApolloConfig;
  public schema?: GraphQLSchema;
  private fileSet: FileSet;
  protected loadingHandler: LoadingHandler;

  protected lastLoadDate?: number;

  constructor({
    config,
    fileSet,
    loadingHandler,
    clientIdentity
  }: GraphQLProjectConfig) {
    this.config = config;
    this.fileSet = fileSet;
    this.loadingHandler = loadingHandler;
    this.schemaProvider = schemaProviderFromConfig(config, clientIdentity);
    const { engine } = config;
    if (engine.apiKey) {
      this.engineClient = new ApolloEngineClient(
        engine.apiKey!,
        engine.endpoint,
        clientIdentity
      );
    }

    this._isReady = false;
    // FIXME: Instead of `Promise.all`, we should catch individual promise rejections
    // so we can show multiple errors.
    this.readyPromise = Promise.all(this.initialize())
      .then(() => {
        this._isReady = true;
        this.invalidate();
      })
      .catch(error => {
        console.error(error);
        this.loadingHandler.showError(
          `Error initializing Apollo GraphQL project "${
            this.displayName
          }": ${error}`
        );
      });
  }

  abstract get displayName(): string;

  protected abstract initialize(): Promise<void>[];

  abstract getProjectStats(): ProjectStats;

  get isReady(): boolean {
    return this._isReady;
  }

  get engine(): ApolloEngineClient {
    // handle error states for missing engine config
    // all in the same place :tada:
    if (!this.engineClient) {
      throw new Error("Unable to find ENGINE_API_KEY");
    }
    return this.engineClient!;
  }

  get whenReady(): Promise<void> {
    return this.readyPromise;
  }

  public updateConfig(config: ApolloConfig) {
    this.config = config;
    return this.initialize();
  }

  public resolveSchema(config: SchemaResolveConfig): Promise<GraphQLSchema> {
    this.lastLoadDate = +new Date();
    return this.schemaProvider.resolveSchema(config);
  }

  public onSchemaChange(handler: NotificationHandler<GraphQLSchema>) {
    this.lastLoadDate = +new Date();
    return this.schemaProvider.onSchemaChange(handler);
  }

  onDiagnostics(handler: NotificationHandler<PublishDiagnosticsParams>) {
    this._onDiagnostics = handler;
  }

  includesFile(uri: DocumentUri) {
    return this.fileSet.includesFile(uri);
  }

  async scanAllIncludedFiles() {
    await this.loadingHandler.handle(
      `Loading queries for ${this.displayName}`,
      (async () => {
        for (const filePath of this.fileSet.allFiles()) {
          const uri = URI.file(filePath).toString();

          // If we already have query documents for this file, that means it was either
          // opened or changed before we got a chance to read it.
          if (this.documentsByFile.has(uri)) continue;

          this.fileDidChange(uri);
        }
      })()
    );
  }

  fileDidChange(uri: DocumentUri) {
    const filePath = URI.parse(uri).fsPath;
    const extension = extname(filePath);
    const languageId = fileAssociations[extension];

    // Don't process files of an unsupported filetype
    if (!languageId) return;

    try {
      const contents = readFileSync(filePath, "utf8");
      const document = TextDocument.create(uri, languageId, -1, contents);
      this.documentDidChange(document);
    } catch (error) {
      console.error(error);
    }
  }

  fileWasDeleted(uri: DocumentUri) {
    this.removeGraphQLDocumentsFor(uri);
  }

  documentDidChange(document: TextDocument) {
    const documents = extractGraphQLDocuments(
      document,
      this.config.client && this.config.client.tagName
    );
    if (documents) {
      this.documentsByFile.set(document.uri, documents);
      this.invalidate();
    } else {
      this.removeGraphQLDocumentsFor(document.uri);
    }
  }

  private removeGraphQLDocumentsFor(uri: DocumentUri) {
    if (this.documentsByFile.has(uri)) {
      this.documentsByFile.delete(uri);

      if (this._onDiagnostics) {
        this._onDiagnostics({ uri: uri, diagnostics: [] });
      }

      this.invalidate();
    }
  }

  protected invalidate() {
    if (!this.needsValidation && this.isReady) {
      setTimeout(() => {
        this.validateIfNeeded();
      }, 0);
      this.needsValidation = true;
    }
  }

  private validateIfNeeded() {
    if (!this.needsValidation || !this.isReady) return;

    this.validate();

    this.needsValidation = false;
  }

  abstract validate(): void;

  clearAllDiagnostics() {
    if (!this._onDiagnostics) return;

    for (const uri of this.documentsByFile.keys()) {
      this._onDiagnostics({ uri, diagnostics: [] });
    }
  }

  documentsAt(uri: DocumentUri): GraphQLDocument[] | undefined {
    return this.documentsByFile.get(uri);
  }

  documentAt(
    uri: DocumentUri,
    position: Position
  ): GraphQLDocument | undefined {
    const queryDocuments = this.documentsByFile.get(uri);
    if (!queryDocuments) return undefined;

    return queryDocuments.find(document => document.containsPosition(position));
  }

  get documents(): GraphQLDocument[] {
    const documents: GraphQLDocument[] = [];
    for (const documentsForFile of this.documentsByFile.values()) {
      documents.push(...documentsForFile);
    }
    return documents;
  }

  get definitions(): DefinitionNode[] {
    const definitions = [];

    for (const document of this.documents) {
      if (!document.ast) continue;

      definitions.push(...document.ast.definitions);
    }

    return definitions;
  }

  definitionsAt(uri: DocumentUri): DefinitionNode[] {
    const documents = this.documentsAt(uri);
    if (!documents) return [];

    const definitions = [];

    for (const document of documents) {
      if (!document.ast) continue;

      definitions.push(...document.ast.definitions);
    }

    return definitions;
  }

  get typeSystemDefinitionsAndExtensions(): (
    | TypeSystemDefinitionNode
    | TypeSystemExtensionNode)[] {
    const definitionsAndExtensions = [];
    for (const document of this.documents) {
      if (!document.ast) continue;
      for (const definition of document.ast.definitions) {
        if (
          isTypeSystemDefinitionNode(definition) ||
          isTypeSystemExtensionNode(definition)
        ) {
          definitionsAndExtensions.push(definition);
        }
      }
    }
    return definitionsAndExtensions;
  }
}
