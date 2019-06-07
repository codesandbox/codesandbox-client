import { GraphQLProject } from "./base";
import { LoadingHandler } from "../loadingHandler";
import { FileSet } from "../fileSet";
import { ServiceConfig } from "../config";
import { ClientIdentity } from "../engine";
import URI from "vscode-uri";

import {
  ApolloFederationInfoProvider,
  federationInfoProviderFromConfig
} from "../providers/federation-info";

export function isServiceProject(
  project: GraphQLProject
): project is GraphQLServiceProject {
  return project instanceof GraphQLServiceProject;
}

export interface GraphQLServiceProjectConfig {
  clientIdentity?: ClientIdentity;
  config: ServiceConfig;
  rootURI: URI;
  loadingHandler: LoadingHandler;
}
export class GraphQLServiceProject extends GraphQLProject {
  public federationInfoProvider: ApolloFederationInfoProvider;

  constructor({
    clientIdentity,
    config,
    rootURI,
    loadingHandler
  }: GraphQLServiceProjectConfig) {
    const fileSet = new FileSet({
      rootURI: config.configDirURI || rootURI,
      includes: [...config.service.includes, ".env", "apollo.config.js"],
      excludes: config.service.excludes,
      configURI: config.configURI
    });

    super({ config, fileSet, loadingHandler, clientIdentity });
    this.config = config;
    this.federationInfoProvider = federationInfoProviderFromConfig(config);
  }

  get displayName() {
    return this.config.name || "Unnamed Project";
  }

  initialize() {
    return [];
  }

  validate() {}

  getProjectStats() {
    return { loaded: true, type: "service" };
  }

  resolveFederationInfo() {
    return this.federationInfoProvider.resolveFederationInfo();
  }
}
