import { gql } from 'overmind-graphql';

export const sidebarSyncedSandboxFragment = gql`
  fragment sidebarSyncedSandboxFragment on Sandbox {
    id
  }
`;

export const sidebarTemplateFragment = gql`
  fragment sidebarTemplateFragment on Template {
    id
  }
`;
