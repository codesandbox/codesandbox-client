import { gql } from 'overmind-graphql';

/**
 * Shared fragments used across multiple namespaces
 * These fragments are not specific to a single namespace and can be reused
 */

/**
 * Minimal collection fields - contains only id and path
 * Used for navigation and folder structure display
 * Optimized without sandboxCount to avoid query complexity
 */
export const COLLECTION_BASIC = gql`
  fragment collectionBasic on Collection {
    id
    path
  }
`;

