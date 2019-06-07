import { GraphQLDataSource } from "./GraphQLDataSource";
import { DefaultEngineConfig, getServiceFromKey } from "../config";
import { CHECK_SCHEMA } from "./operations/checkSchema";
import { UPLOAD_SCHEMA } from "./operations/uploadSchema";
import { VALIDATE_OPERATIONS } from "./operations/validateOperations";
import { REGISTER_OPERATIONS } from "./operations/registerOperations";
import { SCHEMA_TAGS_AND_FIELD_STATS } from "./operations/schemaTagsAndFieldStats";
import { UPLOAD_AND_COMPOSE_PARTIAL_SCHEMA } from "./operations/uploadAndComposePartialSchema";
import { CHECK_PARTIAL_SCHEMA } from "./operations/checkPartialSchema";
import { REMOVE_SERVICE_AND_COMPOSE } from "./operations/removeServiceAndCompose";
import {
  CheckSchema,
  CheckSchemaVariables,
  UploadSchema,
  UploadSchemaVariables,
  UploadAndComposePartialSchema,
  UploadAndComposePartialSchemaVariables,
  RegisterOperations,
  RegisterOperationsVariables,
  ValidateOperations,
  ValidateOperationsVariables,
  SchemaTagsAndFieldStats,
  CheckPartialSchema,
  CheckPartialSchemaVariables,
  RemoveServiceAndCompose,
  RemoveServiceAndComposeVariables
} from "../graphqlTypes";

export interface ClientIdentity {
  name?: string;
  version?: string;
  referenceID?: string;
}

export type ServiceID = string;
export type ClientID = string;
export type SchemaTag = string;
export type ServiceIDAndTag = [ServiceID, SchemaTag?];
export type ServiceSpecifier = string;
export type FieldStats = Map<string, Map<string, number | null>>;

export function noServiceError(service: string | undefined, endpoint?: string) {
  return `Could not find service ${
    service ? service : ""
  } from Engine at ${endpoint}. Please check your API key and service name`;
}

export class ApolloEngineClient extends GraphQLDataSource {
  constructor(
    private engineKey: string,
    engineEndpoint: string = DefaultEngineConfig.endpoint,
    private clientIdentity?: ClientIdentity
  ) {
    super();
    this.baseURL = engineEndpoint;
  }

  // XXX fix typings on base package
  willSendRequest(request: any) {
    if (!request.headers) request.headers = {};
    request.headers["x-api-key"] = this.engineKey;
    if (this.clientIdentity && this.clientIdentity.name) {
      request.headers["apollo-client-name"] = this.clientIdentity.name;
      request.headers[
        "apollo-client-reference-id"
      ] = this.clientIdentity.referenceID;
      request.headers["apollo-client-version"] = this.clientIdentity.version;
      return;
    }

    // default values
    request.headers["apollo-client-name"] = "Apollo Language Server";
    request.headers["apollo-client-reference-id"] =
      "146d29c0-912c-46d3-b686-920e52586be6";
    request.headers[
      "apollo-client-version"
    ] = require("../../package.json").version;
  }

  public async checkSchema(variables: CheckSchemaVariables) {
    return this.execute<CheckSchema>({
      query: CHECK_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (!(data && data.service)) {
        throw new Error("Error in request from Engine");
      }
      return data.service.checkSchema;
    });
  }

  public async uploadSchema(variables: UploadSchemaVariables) {
    return this.execute<UploadSchema>({
      query: UPLOAD_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (!(data && data.service)) {
        throw new Error("Error in request from Engine");
      }
      return data.service.uploadSchema;
    });
  }

  public async uploadAndComposePartialSchema(
    variables: UploadAndComposePartialSchemaVariables
  ) {
    return this.execute<UploadAndComposePartialSchema>({
      query: UPLOAD_AND_COMPOSE_PARTIAL_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (!(data && data.service)) {
        throw new Error("Error in request from Engine");
      }
      return data.service.upsertImplementingServiceAndTriggerComposition;
    });
  }

  public async checkPartialSchema(variables: CheckPartialSchemaVariables) {
    return this.execute<CheckPartialSchema>({
      query: CHECK_PARTIAL_SCHEMA,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (!(data && data.service)) {
        throw new Error("Error in request from Engine");
      }
      return data.service
        .validatePartialSchemaOfImplementingServiceAgainstGraph;
    });
  }

  public async removeServiceAndCompose(
    variables: RemoveServiceAndComposeVariables
  ) {
    return this.execute<RemoveServiceAndCompose>({
      query: REMOVE_SERVICE_AND_COMPOSE,
      variables
    }).then(({ data, errors }) => {
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (!data || !data.service) {
        throw new Error("Error in request from Engine");
      }

      return data.service.removeImplementingServiceAndTriggerComposition;
    });
  }

  public async validateOperations(variables: ValidateOperationsVariables) {
    return this.execute<ValidateOperations>({
      query: VALIDATE_OPERATIONS,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (!(data && data.service)) {
        throw new Error("Error in request from Engine");
      }

      return data.service.validateOperations.validationResults;
    });
  }

  public async registerOperations(variables: RegisterOperationsVariables) {
    return this.execute<RegisterOperations>({
      query: REGISTER_OPERATIONS,
      variables
    }).then(({ data, errors }) => {
      // use error logger
      if (errors) {
        throw new Error(errors.map(error => error.message).join("\n"));
      }

      if (data && !data.service) {
        throw new Error(
          noServiceError(getServiceFromKey(this.engineKey), this.baseURL)
        );
      }

      if (
        !(data && data.service && data.service.registerOperationsWithResponse)
      ) {
        throw new Error("Error in request from Engine");
      }
      return data.service.registerOperationsWithResponse;
    });
  }

  async loadSchemaTagsAndFieldStats(serviceID: string) {
    const { data, errors } = await this.execute<SchemaTagsAndFieldStats>({
      query: SCHEMA_TAGS_AND_FIELD_STATS,
      variables: {
        id: serviceID
      }
    });

    if (!(data && data.service)) {
      throw new Error();
    }

    const schemaTags: string[] = data.service.schemaTags.map(
      ({ tag }: { tag: string }) => tag
    );

    const fieldStats: FieldStats = new Map();

    data.service.stats.fieldStats.forEach(fieldStat => {
      // Parse field "ParentType.fieldName:FieldType" into ["ParentType", "fieldName", "FieldType"]
      const [parentType = null, fieldName = null] = fieldStat.groupBy.field
        ? fieldStat.groupBy.field.split(/\.|:/)
        : [];

      if (!parentType || !fieldName) {
        return;
      }
      const fieldsMap =
        fieldStats.get(parentType) ||
        fieldStats.set(parentType, new Map()).get(parentType)!;

      fieldsMap.set(fieldName, fieldStat.metrics.fieldHistogram.durationMs);
    });

    return { schemaTags, fieldStats };
  }
}
