import {
  DocumentNode
} from 'graphql'

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module "*.gql" {
  const content: DocumentNode;
  export default content;
}
