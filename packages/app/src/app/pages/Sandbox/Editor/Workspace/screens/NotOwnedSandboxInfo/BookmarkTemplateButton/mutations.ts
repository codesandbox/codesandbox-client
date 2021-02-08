import gql from 'graphql-tag';
import { BOOKMARK_TEMPLATE_FRAGMENT } from './queries';

export const BOOKMARK_TEMPLATE = gql`
  mutation BookmarkTemplate($template: UUID4!, $team: UUID4) {
    template: bookmarkTemplate(templateId: $template, teamId: $team) {
      ...BookmarkTemplateFields
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;

export const UNBOOKMARK_TEMPLATE = gql`
  mutation UnbookmarkTemplate($template: UUID4!, $team: UUID4) {
    template: unbookmarkTemplate(templateId: $template, teamId: $team) {
      ...BookmarkTemplateFields
    }
  }

  ${BOOKMARK_TEMPLATE_FRAGMENT}
`;
