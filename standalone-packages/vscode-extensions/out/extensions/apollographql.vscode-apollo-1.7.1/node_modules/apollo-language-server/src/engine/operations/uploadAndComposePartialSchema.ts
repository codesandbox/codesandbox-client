import gql from "graphql-tag";

export const UPLOAD_AND_COMPOSE_PARTIAL_SCHEMA = gql`
  mutation UploadAndComposePartialSchema(
    $id: ID!
    $graphVariant: String!
    $name: String!
    $url: String!
    $revision: String!
    $activePartialSchema: PartialSchemaInput!
  ) {
    service(id: $id) {
      upsertImplementingServiceAndTriggerComposition(
        name: $name
        url: $url
        revision: $revision
        activePartialSchema: $activePartialSchema
        graphVariant: $graphVariant
      ) {
        compositionConfig {
          schemaHash
        }
        errors {
          message
        }
        warnings {
          message
        }
        didUpdateGateway: updatedGateway
        serviceWasCreated: wasCreated
      }
    }
  }
`;
