declare module '*/queries.ts' {
  import { DocumentNode , DocumentNode , DocumentNode } from 'graphql';

  const defaultDocument: DocumentNode;
  export const Template: DocumentNode;
  export const ListPersonalTemplates: DocumentNode;
  export const ListTemplates: DocumentNode;
  export const ListPersonalBookmarkedTemplates: DocumentNode;
  export const MakeSandboxesTemplate: DocumentNode;
  export const UnmakeSandboxesTemplate: DocumentNode;
  export const SidebarCollection: DocumentNode;
  export const Sandbox: DocumentNode;
  export const Team: DocumentNode;
  export const TeamsSidebar: DocumentNode;
  export const CreateTeam: DocumentNode;
  export const PathedSandboxesFolders: DocumentNode;
  export const createCollection: DocumentNode;
  export const deleteCollection: DocumentNode;
  export const renameCollection: DocumentNode;
  export const AddToCollection: DocumentNode;
  export const DeleteSandboxes: DocumentNode;
  export const SetSandboxesPrivacy: DocumentNode;
  export const RenameSandbox: DocumentNode;
  export const PermanentlyDeleteSandboxes: DocumentNode;
  export const PathedSandboxes: DocumentNode;
  export const RecentSandboxes: DocumentNode;
  export const SearchSandboxes: DocumentNode;
  export const DeletedSandboxes: DocumentNode;
  export const Team: DocumentNode;
  export const LeaveTeam: DocumentNode;
  export const RemoveFromTeam: DocumentNode;
  export const InviteToTeam: DocumentNode;
  export const RevokeTeamInvitation: DocumentNode;
  export const AcceptTeamInvitation: DocumentNode;
  export const RejectTeamInvitation: DocumentNode;
  export const SetTeamDescription: DocumentNode;
  export const BookmarkTemplateFields: DocumentNode;
  export const BookmarkedSandboxInfo: DocumentNode;
  export const ClearNotificationCount: DocumentNode;

  export default defaultDocument;
}

declare module '*/mutations.gql' {
  
  const defaultDocument: DocumentNode;
  export const unbookmarkTemplateFromDashboard: DocumentNode;

  export default defaultDocument;
}

declare module '*/mutations.ts' {
  
  const defaultDocument: DocumentNode;
  export const BookmarkTemplate: DocumentNode;
  export const UnbookmarkTemplate: DocumentNode;

  export default defaultDocument;
}
