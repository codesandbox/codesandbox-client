import { DashboardCommunitySandbox } from '../../types';

export interface CommunitySandboxItemComponentProps {
  sandbox: DashboardCommunitySandbox['sandbox'];
  sandboxTitle: string;
  viewCount: number | string;
  TemplateIcon: React.FC<{
    width: string;
    height: string;
    style?: React.CSSProperties;
  }>;
  screenshotUrl: string | null;

  isScrolling: boolean;
  selected: boolean;
  onClick: (evt: React.MouseEvent) => void;
  onDoubleClick: (evt: React.MouseEvent) => void;
  onContextMenu: (evt: React.MouseEvent) => void;
}
