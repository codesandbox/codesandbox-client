
declare module '*/mutations.gql' {
  import { DocumentNode , DocumentNode } from 'graphql';

  const defaultDocument: DocumentNode;
  export const templateFields: DocumentNode;
export const bookmarkTemplateFromCard: DocumentNode;
export const unbookmarkTemplateFromCard: DocumentNode;
export const unbookmarkTemplatee: DocumentNode;
export const templateFields: DocumentNode;
export const bookmarkTemplate: DocumentNode;
export const unbookmarkTemplate: DocumentNode;

  export default defaultDocument;
}
    

declare module '*/queries.gql' {
  
  const defaultDocument: DocumentNode;
  export const isBookmarked: DocumentNode;
export const Sandbox: DocumentNode;
export const Template: DocumentNode;
export const ListFollowedTemplates: DocumentNode;
export const ListTemplates: DocumentNode;
export const getSandboxInfo: DocumentNode;

  export default defaultDocument;
}
    