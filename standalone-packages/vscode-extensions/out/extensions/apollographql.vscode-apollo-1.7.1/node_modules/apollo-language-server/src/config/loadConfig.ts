import cosmiconfig from "cosmiconfig";
import { LoaderEntry } from "cosmiconfig";
import TypeScriptLoader from "@endemolshinegroup/cosmiconfig-typescript-loader";
import { resolve } from "path";
import { readFileSync, existsSync, lstatSync } from "fs";
import merge from "lodash.merge";
import {
  ApolloConfig,
  ApolloConfigFormat,
  DefaultConfigBase,
  DefaultClientConfig,
  DefaultServiceConfig,
  DefaultEngineConfig
} from "./config";
import { getServiceFromKey } from "./utils";
import URI from "vscode-uri";

// config settings
const MODULE_NAME = "apollo";
const defaultFileNames = [
  "package.json",
  `${MODULE_NAME}.config.js`,
  `${MODULE_NAME}.config.ts`
];

const loaders = {
  // XXX improve types for config
  ".json": (cosmiconfig as any).loadJson as LoaderEntry,
  ".js": (cosmiconfig as any).loadJs as LoaderEntry,
  ".ts": {
    async: TypeScriptLoader
  }
};

export interface LoadConfigSettings {
  // the current working directory to start looking for the config
  // config loading only works on node so we default to
  // process.cwd()

  // configPath and fileName are used in conjunction with one another.
  // i.e. /User/myProj/my.config.js
  //    => { configPath: '/User/myProj/', configFileName: 'my.config.js' }
  configPath?: string;

  // if a configFileName is passed in, loadConfig won't accept any other
  // configs as a fallback.
  configFileName?: string;

  // used when run by a `Workspace` where we _know_ a config file should be present.
  requireConfig?: boolean;

  // for CLI usage, we don't _require_ a config file for everything. This allows us to pass in
  // options to build one at runtime
  name?: string;
  type?: "service" | "client";
}

export type ConfigResult<T> = {
  config: T;
  filepath: string;
} | null;

// XXX load .env files automatically
export async function loadConfig({
  configPath,
  configFileName,
  requireConfig = false,
  name,
  type
}: LoadConfigSettings) {
  const explorer = cosmiconfig(MODULE_NAME, {
    searchPlaces: configFileName ? [configFileName] : defaultFileNames,
    loaders
  });

  // search can fail if a file can't be parsed (ex: a nonsense js file) so we wrap in a try/catch
  let loadedConfig;
  try {
    loadedConfig = (await explorer.search(configPath)) as ConfigResult<
      ApolloConfigFormat
    >;
  } catch (error) {
    throw new Error(
      `A config file failed to load with options: ${JSON.stringify(
        arguments[0]
      )}.
      The error was: ${error}`
    );
  }

  if (configPath && !loadedConfig) {
    throw new Error(
      `A config file failed to load at '${configPath}'. This is likely because this file is empty or malformed. For more information, please refer to: https://bit.ly/2ByILPj`
    );
  }

  if (loadedConfig && loadedConfig.filepath.endsWith("package.json")) {
    console.warn(
      'The "apollo" package.json configuration key will no longer be supported in Apollo v3. Please use the apollo.config.js file for Apollo project configuration. For more information, see: https://bit.ly/2ByILPj'
    );
  }

  if (requireConfig && !loadedConfig) {
    throw new Error(
      `No Apollo config found for project. For more information, please refer to:
      https://bit.ly/2ByILPj`
    );
  }

  // add API key from the env
  let engineConfig = {},
    nameFromKey;

  // if there's a .env file, load it and parse for key and service name
  const dotEnvPath = configPath
    ? resolve(configPath, ".env")
    : resolve(process.cwd(), ".env");

  if (existsSync(dotEnvPath) && lstatSync(dotEnvPath).isFile()) {
    const env: { [key: string]: string } = require("dotenv").parse(
      readFileSync(dotEnvPath)
    );
    if (env["ENGINE_API_KEY"]) {
      engineConfig = { engine: { apiKey: env["ENGINE_API_KEY"] } };
      nameFromKey = getServiceFromKey(env["ENGINE_API_KEY"]);
    }
  }

  // DETERMINE PROJECT TYPE
  // The CLI passes in a type when loading config. The editor extension
  // does not. So we determine the type of the config here, and use it if
  // the type wasn't explicitly passed in.
  let projectType: "client" | "service";
  if (type) projectType = type;
  else if (loadedConfig && loadedConfig.config.client) projectType = "client";
  else if (loadedConfig && loadedConfig.config.service) projectType = "service";
  else
    throw new Error(
      "Unable to resolve project type. Please add either a client or service config. For more information, please refer to https://bit.ly/2ByILPj"
    );

  // DETERMINE SERVICE NAME
  // precedence: 1. (highest) config.js (client only) 2. name passed into loadConfig 3. name from api key
  let serviceName = name || nameFromKey;
  if (
    projectType === "client" &&
    loadedConfig &&
    loadedConfig.config.client &&
    typeof loadedConfig.config.client.service === "string"
  ) {
    serviceName = loadedConfig.config.client.service;
  }

  // if there wasn't a config loaded from a file, build one.
  // if there was a service name found in the env, merge it with the new/existing config object.
  // if the config loaded doesn't have a client/service key, add one based on projectType
  if (
    !loadedConfig ||
    serviceName ||
    !(loadedConfig.config.client || loadedConfig.config.service)
  ) {
    loadedConfig = {
      filepath: configPath || process.cwd(),
      config: {
        ...(loadedConfig && loadedConfig.config),
        ...(projectType === "client"
          ? {
              client: {
                ...DefaultConfigBase,
                ...(loadedConfig && loadedConfig.config.client),
                service: serviceName
              }
            }
          : {
              service: {
                ...DefaultConfigBase,
                ...(loadedConfig && loadedConfig.config.service),
                name: serviceName
              }
            })
      }
    };
  }

  let { config, filepath } = loadedConfig;

  // selectively apply defaults when loading the config
  // this is just the includes/excludes defaults.
  // These need to go on _all_ configs. That's why this is last.
  if (config.client) config = merge({ client: DefaultClientConfig }, config);
  if (config.service) config = merge({ service: DefaultServiceConfig }, config);
  if (engineConfig) config = merge(engineConfig, config);

  config = merge({ engine: DefaultEngineConfig }, config);

  return new ApolloConfig(config, URI.file(resolve(filepath)));
}
