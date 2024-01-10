import { DashboardCommunitySandbox } from '../../types';

export type CommunitySandboxItemComponentProps = Pick<
  DashboardCommunitySandbox['sandbox'],
  'title' | 'forkCount' | 'likeCount' | 'screenshotUrl' | 'author'
> & {
  // TODO: Extract TemplateIcon type?
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  isScrolling: boolean;
  selected: boolean;
  liked: boolean;
  url: string;
  interactive?: boolean;
  onClick: (evt: React.MouseEvent) => void;
  onDoubleClick: (evt: React.MouseEvent) => void;
  onContextMenu: (evt: React.MouseEvent) => void;
  onLikeToggle: (evt: React.MouseEvent) => void;
};
