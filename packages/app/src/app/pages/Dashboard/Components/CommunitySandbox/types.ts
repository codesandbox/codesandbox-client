import { DashboardCommunitySandbox } from '../../types';

export type CommunitySandboxItemComponentProps = Pick<
  DashboardCommunitySandbox['sandbox'],
  'title' | 'viewCount' | 'likeCount' | 'screenshotUrl' | 'author'
> & {
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  isScrolling: boolean;
  selected: boolean;
  onClick: (evt: React.MouseEvent) => void;
  onDoubleClick: (evt: React.MouseEvent) => void;
  onContextMenu: (evt: React.MouseEvent) => void;
};
