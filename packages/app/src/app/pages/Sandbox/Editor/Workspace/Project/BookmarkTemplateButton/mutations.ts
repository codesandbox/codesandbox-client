import gql from 'graphql-tag';
import { BOOKMARK_TEMPLATE_FRAGMENT } from './queries';

export const BOOKMARK_TEMPLATE = gql`
  mutation BookmarkTemplateV2($template: ID!, $team: ID) {
    template: bookmarkTemplate(templateId: $template, teamId: $team) {
      ...BookmarkTemplateFields
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;

export const UNBOOKMARK_TEMPLATE = gql`
  mutation UnbookmarkTemplateV2($template: ID!, $team: ID) {
    template: unbookmarkTemplate(templateId: $template, teamId: $team) {
      ...BookmarkTemplateFields
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;
