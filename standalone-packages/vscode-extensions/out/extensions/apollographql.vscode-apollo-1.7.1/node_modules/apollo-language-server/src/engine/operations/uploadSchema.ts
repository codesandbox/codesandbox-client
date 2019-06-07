import gql from "graphql-tag";

export const UPLOAD_SCHEMA = gql`
  mutation UploadSchema(
    $id: ID!
    $schema: IntrospectionSchemaInput!
    $tag: String!
    $gitContext: GitContextInput
  ) {
    service(id: $id) {
      uploadSchema(schema: $schema, tag: $tag, gitContext: $gitContext) {
        code
        message
        success
        tag {
          tag
          schema {
            hash
          }
        }
      }
    }
  }
`;
