import gql from "graphql-tag";

export const CHECK_PARTIAL_SCHEMA = gql`
  mutation CheckPartialSchema(
    $id: ID!
    $graphVariant: String!
    $implementingServiceName: String!
    $partialSchema: PartialSchemaInput!
  ) {
    service(id: $id) {
      validatePartialSchemaOfImplementingServiceAgainstGraph(
        graphVariant: $graphVariant
        implementingServiceName: $implementingServiceName
        partialSchema: $partialSchema
      ) {
        compositionValidationDetails {
          schemaHash
        }
        errors {
          message
        }
        warnings {
          message
        }
      }
    }
  }
`;
