import gql from "graphql-tag";

export const VALIDATE_OPERATIONS = gql`
  mutation ValidateOperations(
    $id: ID!
    $operations: [OperationDocumentInput!]!
    $tag: String
    $gitContext: GitContextInput
  ) {
    service(id: $id) {
      validateOperations(
        tag: $tag
        operations: $operations
        gitContext: $gitContext
      ) {
        validationResults {
          type
          code
          description
          operation {
            name
          }
        }
      }
    }
  }
`;
