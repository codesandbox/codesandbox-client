import { DashboardCommunitySandbox } from '../../types';

export type CommunitySandboxItemComponentProps = Pick<
  DashboardCommunitySandbox['sandbox'],
  'title' | 'forkCount' | 'likeCount' | 'screenshotUrl' | 'author'
> & {
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  isScrolling: boolean;
  selected: boolean;
  liked: boolean;
  onClick: (evt: React.MouseEvent) => void;
  onDoubleClick: (evt: React.MouseEvent) => void;
  onContextMenu: (evt: React.MouseEvent) => void;
  onLikeToggle: (evt: React.MouseEvent) => void;
};
