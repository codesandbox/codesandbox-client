export interface IMatch {
  params: {
    path: string;
  };
}

export interface IFoldersProps {
  me: any; // Replace with a User interface generated from the GraphQL schema
  loading: boolean;
  teamId: string;
  // TODO: This interface should extend RouteComponentProps instead
  history: any;
  match: IMatch;
}
