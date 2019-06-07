import {
  WorkspaceFolder,
  NotificationHandler,
  PublishDiagnosticsParams
} from "vscode-languageserver";
import { QuickPickItem } from "vscode";
import { GraphQLProject, DocumentUri } from "./project/base";
import { dirname } from "path";
import fg from "glob";
import {
  loadConfig,
  ApolloConfig,
  isClientConfig,
  ServiceConfig
} from "./config";
import { LanguageServerLoadingHandler } from "./loadingHandler";
import { ServiceID, SchemaTag, ClientIdentity } from "./engine";
import { GraphQLClientProject, isClientProject } from "./project/client";
import { GraphQLServiceProject } from "./project/service";
import URI from "vscode-uri";

export interface WorkspaceConfig {
  clientIdentity?: ClientIdentity;
}

export class GraphQLWorkspace {
  private _onDiagnostics?: NotificationHandler<PublishDiagnosticsParams>;
  private _onDecorations?: NotificationHandler<any>;
  private _onSchemaTags?: NotificationHandler<[ServiceID, SchemaTag[]]>;
  private _onConfigFilesFound?: NotificationHandler<ApolloConfig[]>;
  private _projectForFileCache: Map<string, GraphQLProject> = new Map();

  private projectsByFolderUri: Map<string, GraphQLProject[]> = new Map();

  constructor(
    private LanguageServerLoadingHandler: LanguageServerLoadingHandler,
    private config: WorkspaceConfig
  ) {}

  onDiagnostics(handler: NotificationHandler<PublishDiagnosticsParams>) {
    this._onDiagnostics = handler;
  }

  onDecorations(handler: NotificationHandler<any>) {
    this._onDecorations = handler;
  }

  onSchemaTags(handler: NotificationHandler<[ServiceID, SchemaTag[]]>) {
    this._onSchemaTags = handler;
  }

  onConfigFilesFound(handler: NotificationHandler<ApolloConfig[]>) {
    this._onConfigFilesFound = handler;
  }

  private createProject({
    config,
    folder
  }: {
    config: ApolloConfig;
    folder: WorkspaceFolder;
  }) {
    const { clientIdentity } = this.config;
    const project = isClientConfig(config)
      ? new GraphQLClientProject({
          config,
          loadingHandler: this.LanguageServerLoadingHandler,
          rootURI: URI.parse(folder.uri),
          clientIdentity
        })
      : new GraphQLServiceProject({
          config: config as ServiceConfig,
          loadingHandler: this.LanguageServerLoadingHandler,
          rootURI: URI.parse(folder.uri),
          clientIdentity
        });

    project.onDiagnostics(params => {
      this._onDiagnostics && this._onDiagnostics(params);
    });

    if (isClientProject(project)) {
      project.onDecorations(params => {
        this._onDecorations && this._onDecorations(params);
      });

      project.onSchemaTags(tags => {
        this._onSchemaTags && this._onSchemaTags(tags);
      });
    }

    return project;
  }

  async addProjectsInFolder(folder: WorkspaceFolder) {
    // load all possible workspace projects (contains possible config)
    // see if we can move this detection to cosmiconfig
    /*

      - monorepo (GraphQLWorkspace) as WorkspaceFolder
        -- engine-api (GraphQLProject)
        -- engine-frontend (GraphQLProject)

      OR

      - vscode workspace (fullstack)
        -- ~/:user/client (GraphQLProject) as WorkspaceFolder
        -- ~/:user/server (GraphQLProject) as WorkspaceFolder

    */
    const apolloConfigFiles: string[] = fg.sync("**/apollo.config.@(js|ts)", {
      cwd: URI.parse(folder.uri).fsPath,
      absolute: true,
      ignore: "**/node_modules/**"
    });

    // only have unique possible folders
    const apolloConfigFolders = new Set<string>(apolloConfigFiles.map(dirname));

    // go from possible folders to known array of configs
    let foundConfigs: ApolloConfig[] = [];

    const projectConfigs = Array.from(apolloConfigFolders).map(configFolder =>
      loadConfig({ configPath: configFolder, requireConfig: true })
        .then(config => {
          foundConfigs.push(config);
          const projectsForConfig = config.projects.map(projectConfig =>
            this.createProject({ config, folder })
          );

          const existingProjects =
            this.projectsByFolderUri.get(folder.uri) || [];

          this.projectsByFolderUri.set(folder.uri, [
            ...existingProjects,
            ...projectsForConfig
          ]);
        })
        .catch(error => console.error(error))
    );

    await Promise.all(projectConfigs);

    if (this._onConfigFilesFound) {
      this._onConfigFilesFound(foundConfigs);
    }
  }

  reloadService() {
    this.projectsByFolderUri.forEach((projects, uri) => {
      this.projectsByFolderUri.set(
        uri,
        projects.map(project => {
          project.clearAllDiagnostics();
          return this.createProject({
            config: project.config,
            folder: { uri } as WorkspaceFolder
          });
        })
      );
    });
  }

  async reloadProjectForConfig(configUri: DocumentUri) {
    const configPath = dirname(URI.parse(configUri).fsPath);

    let config, error;
    try {
      config = await loadConfig({ configPath, requireConfig: true });
    } catch (e) {
      error = e;
    }

    const project = this.projectForFile(configUri);

    if (!config && this._onConfigFilesFound) {
      this._onConfigFilesFound(error);
    }
    // If project exists, update the config
    if (project && config) {
      await Promise.all(project.updateConfig(config));
      this.reloadService();
    }

    // If project doesn't exist (new config file), create the project and add to workspace
    if (!project && config) {
      const folderUri = URI.file(configPath).toString();

      const newProject = this.createProject({
        config,
        folder: { uri: folderUri } as WorkspaceFolder
      });

      const existingProjects = this.projectsByFolderUri.get(folderUri) || [];
      this.projectsByFolderUri.set(folderUri, [
        ...existingProjects,
        newProject
      ]);
      this.reloadService();
    }
  }

  updateSchemaTag(selection: QuickPickItem) {
    const serviceID = selection.detail;
    if (!serviceID) return;

    this.projectsByFolderUri.forEach(projects => {
      projects.forEach(project => {
        if (isClientProject(project) && project.serviceID === serviceID) {
          project.updateSchemaTag(selection.label);
        }
      });
    });
  }

  removeProjectsInFolder(folder: WorkspaceFolder) {
    const projects = this.projectsByFolderUri.get(folder.uri);
    if (projects) {
      projects.forEach(project => project.clearAllDiagnostics());
      this.projectsByFolderUri.delete(folder.uri);
    }
  }

  get projects(): GraphQLProject[] {
    return Array.from(this.projectsByFolderUri.values()).flat();
  }

  projectForFile(uri: DocumentUri): GraphQLProject | undefined {
    const cachedResult = this._projectForFileCache.get(uri);
    if (cachedResult) {
      return cachedResult;
    }

    for (const projects of this.projectsByFolderUri.values()) {
      const project = projects.find(project => project.includesFile(uri));
      if (project) {
        this._projectForFileCache.set(uri, project);
        return project;
      }
    }
    return undefined;
  }
}
