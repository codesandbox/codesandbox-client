import { dirname } from "path";
import merge from "lodash.merge";
import { ServiceID, ServiceSpecifier, ClientID } from "../engine";
import URI from "vscode-uri";
import { WithRequired } from "apollo-env";
import { getServiceName, parseServiceSpecifier } from "./utils";
import { ValidationRule } from "graphql/validation/ValidationContext";

export interface EngineStatsWindow {
  to: number;
  from: number;
}

export const DefaultEngineStatsWindow = {
  to: -0,
  from: -86400 // one day
};

export interface HistoricalEngineStatsWindow extends EngineStatsWindow {}

export type EndpointURI = string;
export interface RemoteServiceConfig {
  name: ServiceID;
  url: EndpointURI;
  headers?: { [key: string]: string };
  skipSSLValidation?: boolean;
}

export interface LocalServiceConfig {
  name: ServiceID;
  localSchemaFile: string;
}

export interface EngineConfig {
  endpoint?: EndpointURI;
  frontend?: EndpointURI;
  readonly apiKey?: string;
}

export const DefaultEngineConfig = {
  endpoint: "https://engine-graphql.apollographql.com/api/graphql",
  frontend: "https://engine.apollographql.com"
};

export const DefaultConfigBase = {
  includes: ["src/**/*.{ts,tsx,js,jsx,graphql,gql}"],
  excludes: ["**/node_modules", "**/__tests__"]
};

export interface ConfigBase {
  includes: string[];
  excludes: string[];
}

export type ClientServiceConfig = RemoteServiceConfig | LocalServiceConfig;

export interface ClientConfigFormat extends ConfigBase {
  // service linking
  service?: ServiceSpecifier | ClientServiceConfig;
  // client identity
  name?: ClientID;
  referenceID?: string;
  version?: string;
  // client schemas
  clientOnlyDirectives?: string[];
  clientSchemaDirectives?: string[];
  addTypename?: boolean;
  tagName?: string;
  // stats window config
  statsWindow?: EngineStatsWindow;

  /**
   * Rules that will be applied when validating GraphQL documents.
   *
   * If you wish to modify the default list of validation rules, import them from the apollo package and
   * assign your custom list:
   *
   * ```js
   * const { defaultValidationRules } = require("apollo/lib/defaultValidationRules");
   *
   * module.exports = {
   *   // ...
   *   validationRules: [...defaultValidationRules, ...customRules]
   * }
   * ```
   *
   * Or, if you simply wish to filter out some rules from the default list, you can specify a filter function:
   *
   * ```js
   * module.exports = {
   *   // ...
   *   validationRules: rule => rule.name !== "NoAnonymousQueries"
   * }
   * ```
   */
  validationRules?: ValidationRule[] | ((rule: ValidationRule) => boolean);
}

export const DefaultClientConfig = {
  ...DefaultConfigBase,
  tagName: "gql",
  clientOnlyDirectives: ["connection", "type"],
  clientSchemaDirectives: ["client", "rest"],
  addTypename: true,
  statsWindow: DefaultEngineStatsWindow
};

export interface ServiceConfigFormat extends ConfigBase {
  name?: string;
  endpoint?: Exclude<RemoteServiceConfig, "name">;
  localSchemaFile?: string;
}

export const DefaultServiceConfig = {
  ...DefaultConfigBase,
  endpoint: {
    url: "http://localhost:4000/graphql"
  }
};

export interface ConfigBaseFormat {
  client?: ClientConfigFormat;
  service?: ServiceConfigFormat;
  engine?: EngineConfig;
}

export type ApolloConfigFormat =
  | WithRequired<ConfigBaseFormat, "client">
  | WithRequired<ConfigBaseFormat, "service">;

export class ApolloConfig {
  public isClient: boolean;
  public isService: boolean;
  public engine: EngineConfig;
  public name?: string;
  public service?: ServiceConfigFormat;
  public client?: ClientConfigFormat;
  private _tag?: string;

  constructor(public rawConfig: ApolloConfigFormat, public configURI?: URI) {
    this.isService = !!rawConfig.service;
    this.isClient = !!rawConfig.client;
    this.engine = rawConfig.engine!;
    this.name = getServiceName(rawConfig);
    this.client = rawConfig.client;
    this.service = rawConfig.service;
  }

  get configDirURI() {
    return this.configURI && this.configURI.fsPath.includes(".js")
      ? URI.parse(dirname(this.configURI.fsPath))
      : this.configURI;
  }

  get projects() {
    const configs = [];
    const { client, service } = this.rawConfig;
    if (client) configs.push(new ClientConfig(this.rawConfig, this.configURI));
    if (service)
      configs.push(new ServiceConfig(this.rawConfig, this.configURI));
    return configs;
  }

  set tag(tag: string) {
    this._tag = tag;
  }

  get tag(): string {
    if (this._tag) return this._tag;
    let tag: string = "current";
    if (this.client && typeof this.client.service === "string") {
      const specifierTag = parseServiceSpecifier(this.client
        .service as ServiceSpecifier)[1];
      if (specifierTag) tag = specifierTag;
    }
    return tag;
  }

  // this type needs to be an "EveryKeyIsOptionalApolloConfig"
  public setDefaults({ client, engine, service }: any): void {
    const config = merge(this.rawConfig, { client, engine, service });
    this.rawConfig = config;
    this.client = config.client;
    this.service = config.service;
    if (engine) this.engine = config.engine;
  }
}

export class ClientConfig extends ApolloConfig {
  public client!: ClientConfigFormat;
}

export class ServiceConfig extends ApolloConfig {
  public service!: ServiceConfigFormat;
}
