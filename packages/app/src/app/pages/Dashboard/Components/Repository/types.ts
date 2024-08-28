import { ProjectFragment as Repository } from 'app/graphql/types';

export type RepositoryProps = {
  repository: Pick<Repository['repository'], 'owner' | 'name' | 'private'> & {
    url: string;
  };
  labels: {
    branches: string;
    repository: string;
  };
  onContextMenu: (evt: React.MouseEvent) => void;
  onClick?: (evt: React.MouseEvent) => void;
  selected: boolean;
  isBeingRemoved: boolean;
  appInstalled: boolean;
};
