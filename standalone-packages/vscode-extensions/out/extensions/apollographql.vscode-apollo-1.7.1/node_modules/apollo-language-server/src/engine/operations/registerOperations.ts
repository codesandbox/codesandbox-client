import gql from "graphql-tag";

export const REGISTER_OPERATIONS = gql`
  mutation RegisterOperations(
    $id: ID!
    $clientIdentity: RegisteredClientIdentityInput!
    $operations: [RegisteredOperationInput!]!
    $manifestVersion: Int!
  ) {
    service(id: $id) {
      registerOperationsWithResponse(
        clientIdentity: $clientIdentity
        operations: $operations
        manifestVersion: $manifestVersion
      ) {
        invalidOperations {
          errors {
            message
          }
          signature
        }
        newOperations {
          signature
        }
        registrationSuccess
      }
    }
  }
`;
