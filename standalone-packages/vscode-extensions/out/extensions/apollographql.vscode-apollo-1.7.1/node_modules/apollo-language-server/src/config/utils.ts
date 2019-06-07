import {
  ApolloConfig,
  ClientConfig,
  ClientServiceConfig,
  LocalServiceConfig,
  ServiceConfig,
  ApolloConfigFormat
} from "./config";
import { ServiceSpecifier, ServiceIDAndTag } from "../engine";

export function isClientConfig(config: ApolloConfig): config is ClientConfig {
  return config.isClient;
}

// checks the `config.client.service` object for a localSchemaFile
export function isLocalServiceConfig(
  config: ClientServiceConfig
): config is LocalServiceConfig {
  return !!(config as LocalServiceConfig).localSchemaFile;
}

export function isServiceConfig(config: ApolloConfig): config is ServiceConfig {
  return config.isService;
}

export function getServiceFromKey(key?: string) {
  if (key) {
    const [type, service] = key.split(":");
    if (type === "service") return service;
  }
  return;
}

export function getServiceName(config: ApolloConfigFormat) {
  if (config.service) return config.service.name;
  if (config.client) {
    if (typeof config.client.service === "string") {
      return parseServiceSpecifier(config.client
        .service as ServiceSpecifier)[0];
    }
    return config.client.service && config.client.service.name;
  } else {
    return undefined;
  }
}

export function parseServiceSpecifier(specifier: ServiceSpecifier) {
  const [id, tag] = specifier.split("@").map(x => x.trim());
  return [id, tag] as ServiceIDAndTag;
}
